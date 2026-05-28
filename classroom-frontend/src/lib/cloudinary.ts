import { CLOUDINARY_CLOUD_NAME } from "@/constants";

/**
 * Creates a Cloudinary image configuration object for use with @cloudinary/react AdvancedImage
 * @param publicId - The Cloudinary public ID of the image
 * @param options - Optional transformation parameters
 * @returns Object with publicId and transformations for AdvancedImage
 */
export const bannerPhoto = (
    publicId: string | null | undefined,
    name?: string,
    options?: {
        width?: number;
        height?: number;
        quality?: string;
    }
): { publicId: string; transformations?: string[] } | null => {
    if (!publicId || !CLOUDINARY_CLOUD_NAME) {
        return null;
    }

    const {
        width = 1200,
        height = 400,
        quality = "auto",
    } = options || {};

    return {
        publicId,
        transformations: [
            `w_${width}`,
            `h_${height}`,
            `q_${quality}`,
            "f_auto",
            "c_fill",
            "g_auto",
        ],
    };
};

/**
 * Generates a Cloudinary image URL directly (for regular img tags)
 * @param publicId - The Cloudinary public ID of the image
 * @param options - Optional transformation parameters
 * @returns Optimized Cloudinary image URL
 */
export const getCloudinaryUrl = (
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        quality?: string;
        format?: string;
    }
): string => {
    if (!publicId || !CLOUDINARY_CLOUD_NAME) {
        return "";
    }

    const {
        width = 800,
        height = 600,
        quality = "auto",
        format = "auto",
    } = options || {};

    const transformations = [
        `w_${width}`,
        `h_${height}`,
        `q_${quality}`,
        `f_${format}`,
    ].join(",");

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

/**
 * Generates a placeholder image URL with initials
 * @param name - Name to generate initials from
 * @returns Placeholder image URL
 */
export const getPlaceholderUrl = (name?: string): string => {
    if (!name) {
        return "https://placehold.co/600x400?text=NA";
    }

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return `https://placehold.co/600x400?text=${encodeURIComponent(initials || "NA")}`;
};

/**
 * Gets the banner image URL - uses Cloudinary if available, falls back to placeholder
 * @param bannerUrl - Direct image URL
 * @param bannerCldPubId - Cloudinary public ID
 * @param teacherName - Teacher name for placeholder
 * @returns Final banner image URL
 */
export const getBannerUrl = (
    bannerUrl?: string | null,
    bannerCldPubId?: string | null,
    teacherName?: string
): string => {
    // Priority 1: Direct banner URL
    if (bannerUrl) {
        return bannerUrl;
    }

    // Priority 2: Cloudinary image
    if (bannerCldPubId) {
                const cloudinaryUrl = getCloudinaryUrl(bannerCldPubId, { width: 1200, height: 400 });
                if (cloudinaryUrl) return cloudinaryUrl;
            }

    // Priority 3: Placeholder with teacher initials
    return getPlaceholderUrl(teacherName);
};
