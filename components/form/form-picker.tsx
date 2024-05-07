import React, { useEffect, useState } from "react";
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[]>;
}
export default function FormPicker({ id, errors }: FormPickerProps) {
    const [images, setImages] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const { pending } = useFormStatus();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                });
                if (result && result.response) {
                    const data = result.response as Array<Record<string, any>>;
                    setImages(data);
                } else {
                    console.error("Failed to get images from Unsplash!");
                }
            } catch (err) {
                console.log(err);
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    return (
        <div className="grid grid-cols-3 gap-2 mb-2">
            {images.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                        pending && "opacity-50 hover:opacity-50 cursor-auto"
                    )}
                    onClick={() => {
                        if (pending) return;
                        setSelectedImageId(item.id);
                    }}
                >
                    <input
                        type="radio"
                        id={id}
                        name={id}
                        className="hidden"
                        checked={selectedImageId === item.id}
                        readOnly
                        disabled={pending}
                        value={`${item.id}|${item.urls.thumb}|${item.urls.full}|${item.links.html}|${item.user.name}`}
                    />

                    <Image src={item.urls.thumb} alt="board image" fill />
                    {selectedImageId === item.id && (
                        <div className="absolute  h-full w-full inset-y-0 flex items-center justify-center bg-black/30">
                            <Check className="h-4 w-4 text-white" />
                        </div>
                    )}
                    <Link
                        target="_blank"
                        href={item.links.html}
                        className="absolute bottom-0 truncate text-[10px] opacity-0 group-hover:opacity-100 w-full text-white bg-black/50 p-1 hover:underline"
                    >
                        {item.user.name}
                    </Link>
                </div>
            ))}
            <FormErrors id="image" errors={errors} />
        </div>
    );
}
