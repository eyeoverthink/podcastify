import { Metadata } from "next";
import ImageStudio from "./components/image-studio";

export const metadata: Metadata = {
  title: "AI Image Studio",
  description: "Create, edit, and enhance images with AI assistance",
};

export default function ImagePage() {
  return <ImageStudio />;
}
