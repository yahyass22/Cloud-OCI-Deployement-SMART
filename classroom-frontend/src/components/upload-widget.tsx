import {useEffect, useRef, useState} from 'react'
import {UploadCloud, X} from "lucide-react";
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured} from "@/constants";
import type { UploadWidgetValue, UploadWidgetProps } from "@/types";

interface CloudinaryWidget {
    open: () => void;
    destroy: () => void;
}



const UploadWidget = ({value = null, onChange = () => {}, disabled = false}: UploadWidgetProps) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if (!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!isCloudinaryConfigured()) {
            console.warn("Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET, and VITE_CLOUDINARY_UPLOAD_URL");
            return;
        }

        let intervalId: number | null = null;
        let retries = 0;
        const MAX_RETRIES = 20; // 10 seconds

        const initializeWidget = () => {
            if (!window.cloudinary) {
                console.log("Cloudinary script not loaded yet");
                return false;
            }

            try {
                console.log("Initializing Cloudinary widget...");
                widgetRef.current = window.cloudinary.createUploadWidget({
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                    multiple: false,
                    folder: 'uploads',
                    maxFileSize: 5000000,
                    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                    sources: ['local', 'url', 'camera', 'unsplash', 'facebook', 'instagram', 'shutterstock', 'getty'],
                    styles: {
                        palette: {
                            window: "#FFFFFF",
                            windowBorder: "#90A0B3",
                            otel: "#004E98",
                            primary: "#004E98",
                            primaryHover: "#003D78",
                            sourceBg: "#F5F7FA",
                            error: "#FF3B30",
                            inProgress: "#004E98",
                            complete: "#28C94B",
                            textDark: "#101920",
                            textLight: "#FCFFFE",
                            transition: "all 0.2s ease",
                        },
                    },
                }, (error, result) => {
                    console.log("Cloudinary callback triggered:", { error, event: result?.event });
                    if (!error && result?.event === 'success') {
                        console.log("Upload success:", result.info);
                        const payload: UploadWidgetValue = {
                            url: result.info.secure_url,
                            publicId: result.info.public_id,
                        };
                        setPreview(payload);
                        setDeleteToken(result.info.delete_token ?? null);
                        onChangeRef.current?.(payload);
                    } else if (error) {
                        console.error("Cloudinary upload error:", error);
                    }
                });
                console.log("Cloudinary widget initialized successfully");
                return true;
            } catch (err) {
                console.error("Failed to initialize Cloudinary widget:", err);
                return false;
            }
        };

        // Try to initialize immediately
        if (initializeWidget()) return;

        // Retry with interval if immediate initialization fails
        intervalId = window.setInterval(() => {
            retries++;
            if (initializeWidget() || retries >= MAX_RETRIES) {
                if (retries >= MAX_RETRIES) {
                    console.warn("Cloudinary widget failed to load after retries.");
                }
                if (intervalId) window.clearInterval(intervalId);
            }
        }, 500);

        return () => {
            if (intervalId) window.clearInterval(intervalId);
            widgetRef.current?.destroy();
            widgetRef.current = null;
        };
    }, []);

    const openWidget = () => {
        if (!disabled) widgetRef.current?.open();
    };

    const clearUpload = () => {
        setIsRemoving(true);
        setPreview(null);
        onChange(null);
        setIsRemoving(false);
    };

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="relative group">
                    <img
                        src={preview.url}
                        alt="Uploaded file"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <button
                        type="button"
                        onClick={clearUpload}
                        disabled={isRemoving}
                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {isRemoving ? (
                            <span className="h-4 w-4 animate-spin">⏳</span>
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                    </button>
                </div>
            ) : (
                <div
                    className="upload-dropzone border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-lg p-8 cursor-pointer transition-colors hover:bg-accent/50"
                    role="button"
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >
                    <div className="upload-prompt flex flex-col items-center justify-center gap-2 text-center">
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Click to Upload Photo</p>
                            <p className="text-xs text-muted-foreground">PNG, JPEG up to 5MB</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;
