import { injectable } from 'inversify';
import type { IProviderAPI } from './interface';
import { z } from 'zod';
import {
  type GameVersion,
  type Loader,
  type NewGameVersion,
  type NewLoader,
  newLoaderSchema,
} from '../../game/schema';
import type { FilledMod } from '../../mod/schema';

const BASE_URL = 'https://api.modrinth.com/v2';

const modrinthVersionSchema = z.object({
  version: z.string(),
  version_type: z.string(),
});

type ModrinthVersion = z.infer<typeof modrinthVersionSchema>;

function modrinthToGameVersion(v: ModrinthVersion): GameVersion {
  if (v.version_type !== 'release' && v.version_type !== 'snapshot') {
    v.version_type = 'release';
  }

  return {
    version: v.version,
    type: v.version_type as GameVersion['type'],
  };
}

// ── Project ──────────────────────────────────────────────────────────────────

const ModeratorMessageSchema = z.object({
  message: z.string(),
  body: z.nullable(z.string()),
});

const LicenseSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.nullable(z.string()),
});

const DonationUrlSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string(),
});

const GalleryImageSchema = z.object({
  url: z.string(),
  featured: z.boolean(),
  title: z.nullable(z.string()),
  description: z.nullable(z.string()),
  created: z.iso.datetime(),
  ordering: z.int().optional(),
});

const ModrinthProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  client_side: z.enum(['required', 'optional', 'unsupported', 'unknown']),
  server_side: z.enum(['required', 'optional', 'unsupported', 'unknown']),
  body: z.string(),
  status: z.enum([
    'approved',
    'archived',
    'rejected',
    'draft',
    'unlisted',
    'processing',
    'withheld',
    'scheduled',
    'private',
    'unknown',
  ]),
  requested_status: z
    .nullable(z.enum(['approved', 'archived', 'unlisted', 'private', 'draft']))
    .optional(),
  additional_categories: z.array(z.string()).optional(),
  issues_url: z.nullable(z.string()).optional(),
  source_url: z.nullable(z.string()).optional(),
  wiki_url: z.nullable(z.string()).optional(),
  discord_url: z.nullable(z.string()).optional(),
  donation_urls: z.array(DonationUrlSchema).optional(),
  project_type: z.enum(['mod', 'modpack', 'resourcepack', 'shader']),
  downloads: z.int().nonnegative(),
  icon_url: z.nullable(z.string()).optional(),
  color: z.nullable(z.int()).optional(),
  thread_id: z.string().optional(),
  monetization_status: z.enum(['monetized', 'demonetized', 'force-demonetized']).optional(),
  id: z.string(),
  team: z.string(),
  body_url: z.nullable(z.string()).optional(),
  moderator_message: z.nullable(ModeratorMessageSchema).optional(),
  published: z.iso.datetime(),
  updated: z.iso.datetime(),
  approved: z.nullable(z.iso.datetime()).optional(),
  queued: z.nullable(z.iso.datetime()).optional(),
  followers: z.int().nonnegative(),
  license: LicenseSchema.optional(),
  versions: z.array(z.string()).optional(),
  game_versions: z.array(z.string()).optional(),
  loaders: z.array(z.string()).optional(),
  gallery: z.array(GalleryImageSchema).optional(),
});

// ── Version ───────────────────────────────────────────────────────────────────

const DependencySchema = z.object({
  version_id: z.nullable(z.string()),
  project_id: z.nullable(z.string()),
  file_name: z.nullable(z.string()),
  dependency_type: z.enum(['required', 'optional', 'incompatible', 'embedded']),
});

const FileHashesSchema = z.object({
  sha512: z.string().optional(),
  sha1: z.string().optional(),
});

const VersionFileSchema = z.object({
  hashes: FileHashesSchema,
  url: z.string(),
  filename: z.string(),
  primary: z.boolean(),
  size: z.int().nonnegative(),
  file_type: z
    .nullable(
      z.enum([
        'required-resource-pack',
        'optional-resource-pack',
        'sources-jar',
        'dev-jar',
        'javadoc-jar',
        'unknown',
        'signature',
      ]),
    )
    .optional(),
});

const ModrinthVersionSchema = z.object({
  name: z.string(),
  version_number: z.string(),
  changelog: z.nullable(z.string()).optional(),
  dependencies: z.array(DependencySchema),
  game_versions: z.array(z.string()),
  version_type: z.enum(['release', 'beta', 'alpha']),
  loaders: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(['listed', 'archived', 'draft', 'unlisted', 'scheduled', 'unknown']),
  requested_status: z.nullable(z.enum(['listed', 'archived', 'draft', 'unlisted'])).optional(),
  id: z.string(),
  project_id: z.string(),
  author_id: z.string(),
  date_published: z.iso.datetime(),
  downloads: z.int().nonnegative(),
  changelog_url: z.nullable(z.string()).optional(),
  files: z.array(VersionFileSchema),
});

const ModrinthVersionListSchema = z.array(ModrinthVersionSchema);

// ── Types ─────────────────────────────────────────────────────────────────────

type ModrinthProject = z.infer<typeof ModrinthProjectSchema>;
type ModrinthVersionList = z.infer<typeof ModrinthVersionListSchema>;

@injectable()
export class ModrinthAPIv270 implements IProviderAPI {
  private async getModInfo(slug: string): Promise<ModrinthProject> {
    try {
      const url = new URL(`/v2/project/${slug}`, BASE_URL);
      const req = await fetch(url);

      const data = await req.json();
      return ModrinthProjectSchema.parse(data);
    } catch (e) {
      console.error('fetch mod info failed');
      console.error(e);
      throw e;
    }
  }

  private async getModVersions(slug: string): Promise<ModrinthVersionList> {
    try {
      const url = new URL(`/v2/project/${slug}/version`, BASE_URL);
      const req = await fetch(url);

      const data = await req.json();
      return ModrinthVersionListSchema.parse(data);
    } catch (e) {
      console.error('fetch mod versions failed');
      console.error(e);
      throw e;
    }
  }

  private constructModUrl(slug: string): string {
    return `https://modrinth.com/mod/${slug}`;
  }

  async getFilledModFromSlug(slug: string): Promise<FilledMod> {
    const mod = await this.getModInfo(slug);
    const versions = await this.getModVersions(slug);

    return {
      id: mod.id,
      slug,
      url: this.constructModUrl(slug),
      rawName: slug,
      provider: 'modrinth',
      info: {
        id: mod.id,
        modId: mod.id,
        title: mod.title,
        description: mod.description,
        iconUrl: mod.icon_url ?? null,
      },
      versions: versions.map((v) => ({
        id: v.id,
        modId: mod.id,
        name: v.name,
        version: v.version_number,
        date: v.date_published,
        gameVersion: v.game_versions[0],
        loader: v.loaders[0],
        downloadUrl: v.files[0].url,
        fileName: v.files[0].filename,
        fileSize: v.files[0].size,
      })),
    };
  }

  async getGameVersions(): Promise<NewGameVersion[]> {
    try {
      const url = new URL('/v2/tag/game_version', BASE_URL);
      const req = await fetch(url);
      const data = await req.json();

      const versions = z.array(modrinthVersionSchema).parse(data);

      return versions.map(modrinthToGameVersion);
    } catch (e) {
      console.error('fetch versions from modrinth failed');
      console.error(e);
      return [];
    }
  }

  async getGameLoaders(): Promise<NewLoader[]> {
    try {
      const url = new URL('/v2/tag/loader', BASE_URL);
      const req = await fetch(url);
      const data = await req.json();

      return z.array(newLoaderSchema).parse(data);
    } catch (e) {
      console.error('fetch versions from modrinth failed');
      console.error(e);
      return [];
    }
  }
}
