import type { ImageMetadata } from "astro";
import dashfi from "@/assets/img/dashfi.png";
import datastax from "@/assets/img/datastax.png";
import langflow from "@/assets/img/langflow.png";
import luxylist from "@/assets/img/luxylist.png";
import tina from "@/assets/img/tina.png";

export interface Project {
  name: string;
  /** Short, stack-focused description shown in the index row. */
  tags: string;
  year?: string;
  url?: string;
  image: ImageMetadata;
}

// TODO(José): confirm which projects stay, and fill in real tags, years and links.
export const projects: Project[] = [
  { name: "Luxylist", tags: "Frontend · Web", image: luxylist },
  { name: "DataStax", tags: "Frontend · Web", image: datastax },
  { name: "Langflow", tags: "Frontend · Web", image: langflow },
  { name: "Tina Rosero", tags: "Frontend · Web", image: tina },
  { name: "Dash-Fi", tags: "Frontend · Web", image: dashfi },
];
