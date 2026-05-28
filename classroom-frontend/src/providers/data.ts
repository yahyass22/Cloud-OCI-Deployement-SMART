import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";

import {BACKEND_BASE_URL} from "@/constants";
import {CreateResponse, GetOneResponse, ListResponse} from "@/types";
import {HttpError} from "@refinedev/core";
import { queryClient } from "@/lib/queryClient";

const buildHttpError = async ( response: Response):Promise<HttpError> => {
    let message = 'Request failed.';
    try {
        const payload = (await response.json()) as {message?: string}


        if (payload?.message) message = payload.message;

    }catch{
        // ignor errors
    }
    return {
        message,
        statusCode: response.status
    }
}

// Helper function to flatten filter groups
const flattenFilters = (filters: any[]): any[] => {
    const result: any[] = [];
    filters?.forEach((filter) => {
        if (filter && typeof filter === 'object') {
            if ('operator' in filter && 'value' in filter && Array.isArray(filter.value)) {
                // This is a filter group (AND/OR)
                result.push(...flattenFilters(filter.value));
            } else if ('field' in filter) {
                // This is a simple filter
                result.push(filter);
            }
        }
    });
    return result;
};

/**
 * Invalidates relevant queries after a mutation
 * This ensures fresh data is fetched after create/update/delete operations
 */
const invalidateQueries = (resource: string, action: 'create' | 'update' | 'deleteOne', id?: string | number) => {
    const normalizedId = id !== undefined && id !== null ? String(id) : undefined;
    // Always invalidate dashboard when data changes
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });

    // Invalidate the specific resource
    queryClient.invalidateQueries({ queryKey: [resource] });

    // Invalidate or remove specific item if ID is provided
    if (normalizedId) {
        if (action === 'deleteOne') {
            queryClient.removeQueries({ queryKey: [resource, normalizedId] });
        } else {
            queryClient.invalidateQueries({ queryKey: [resource, normalizedId] });
        }
    }

    // Cross-resource invalidation rules
    if (resource === 'classes') {
        // When classes change, also invalidate discussions for that class
        if (normalizedId) {
            if (action === 'deleteOne') {
                queryClient.removeQueries({ queryKey: ["discussions", "class", normalizedId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["discussions", "class", normalizedId] });
            }
        }
        queryClient.invalidateQueries({ queryKey: ["discussions"] });
    }

    if (resource === 'subjects') {
        // When subjects change, classes might be affected
        queryClient.invalidateQueries({ queryKey: ["classes"] });
    }

    if (resource === 'users') {
        // When users change, classes and discussions might be affected
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["discussions"] });
    }

    if (resource === 'discussions') {
        // When discussions change, invalidate the specific discussion and its class discussions
        if (normalizedId) {
            if (action === 'deleteOne') {
                queryClient.removeQueries({ queryKey: ["discussions", normalizedId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["discussions", normalizedId] });
            }
        }
    }
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
      buildQueryParams: async({resource , pagination , filters})=>{
        const page = pagination?.currentPage ?? 1 ;
        const pageSize=pagination?.pageSize ?? 10 ;

        const params: Record<string, string|number> ={page,limit : pageSize};

        // Flatten any nested filter groups
        const flatFilters = flattenFilters(filters || []);

        flatFilters.forEach((filter) => {
            const field = filter.field;
            const value = String(filter.value);
            if (resource === 'subjects'){
                if(field === 'department' || field === 'department.name') params.department= value ;
                if ((field === 'name' || field === 'code') && !params.search) {
                    params.search = value;
                }
            }
            if (resource === 'classes'){
                if(field === 'subjectId') params.subjectId = value;
                if(field === 'teacherId') params.teacherId = value;
                if (field === 'name' && !params.search) {
                    params.search = value;
                }
            }
          })
          return params ;
      },
    mapResponse: async (response) => {
        if (!response.ok) throw await buildHttpError(response);
        const payload: ListResponse = await response.clone().json();
        return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
    create: {
      getEndpoint: ({ resource }) => resource,
      buildQueryParams: async({variables})=> variables,
        mapResponse: async (response, { resource }) => {
          if (!response.ok) {
              throw await buildHttpError(response);
          }
          const json:CreateResponse = await response.json();
          // Invalidate cache after successful create
          const createdData = json.data as any;
          const createdId = createdData?.id;
          invalidateQueries(resource, 'create', createdId);
          return json.data ?? [] ;
        }
      },

    getOne:{
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
        mapResponse: async(response) =>{
          if (!response.ok) throw await buildHttpError(response);
          const json : GetOneResponse= await response.json();
          return json.data ?? null;
        }
    },

    update: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
      buildQueryParams: async({ id, variables }) => ({ id, ...variables }),
      mapResponse: async (response, { resource, id }) => {
        if (!response.ok) {
            throw await buildHttpError(response);
        }
        const json: CreateResponse = await response.json();
        // Invalidate cache after successful update
        invalidateQueries(resource, 'update', id);
        return json.data ?? null;
      }
    },

    deleteOne: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
      buildQueryParams: async({ id }) => ({ id }),
      mapResponse: async (response, { resource, id }) => {
        if (!response.ok) {
            throw await buildHttpError(response);
        }

        let json: CreateResponse | null = null;
        const hasBody =
            response.status !== 204 &&
            response.headers.get("content-length") !== "0";

        if (hasBody) {
            const text = await response.text();
            if (text) {
                try {
                    json = JSON.parse(text) as CreateResponse;
                } catch {
                    // ignore invalid/empty JSON bodies
                }
            }
        }

        const deletedId = id ?? (json?.data as any)?.id;
        invalidateQueries(resource, 'deleteOne', deletedId);
        return json?.data ?? null;
      }
    }

};
const {dataProvider} = createDataProvider(BACKEND_BASE_URL, options);
export {dataProvider};
