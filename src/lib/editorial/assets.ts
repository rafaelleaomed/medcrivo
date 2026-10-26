import path from "node:path";

const PROJECT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PATTERN = /^slide-\d{2}\.jpg$/;

export function resolveEditorialAssetPath(root: string, segments: string[]): string | null {
  if (segments.length !== 2) return null;
  const [project, image] = segments;
  if (!PROJECT_PATTERN.test(project) || !IMAGE_PATTERN.test(image)) return null;

  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, project, image);
  return resolved.startsWith(`${resolvedRoot}${path.sep}`) ? resolved : null;
}

export function privateEditorialImages(slotId: string, urls: string[]): string[] {
  if (!PROJECT_PATTERN.test(slotId)) return [];
  return urls.map((url) => {
    const filename = url.split("/").at(-1);
    return filename && IMAGE_PATTERN.test(filename) ? `/api/editorial/assets/${slotId}/${filename}` : "";
  }).filter(Boolean);
}
