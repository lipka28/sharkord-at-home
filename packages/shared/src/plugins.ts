import z from "zod";

const zPluginPackageJson = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9-.]+)?$/, "Invalid version format"),
  name: z.string().min(1, "Package name is required"),
  sharkord: z.object({
    entry: z.string().endsWith(".js", "Plugin entry file must be a .js file"),
    author: z.string().min(1, "Plugin author is required"),
    homepage: z.url().optional(),
    description: z.string().min(1, "Plugin description is required"),
    logo: z.string().optional(),
    enabled: z.boolean().optional().default(true),
  }),
});

type TPluginPackageJson = z.infer<typeof zPluginPackageJson>;

type TPluginInfo = {
  id: string;
  enabled: boolean;
  loadError?: string;
  author: TPluginPackageJson["sharkord"]["author"];
  description: TPluginPackageJson["sharkord"]["description"];
  version: TPluginPackageJson["version"];
  logo: TPluginPackageJson["sharkord"]["logo"];
  name: TPluginPackageJson["name"];
  homepage: TPluginPackageJson["sharkord"]["homepage"];
  path: string;
  entry: string;
};

export type { TPluginInfo };
export { zPluginPackageJson };
