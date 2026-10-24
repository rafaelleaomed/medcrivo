#!/usr/bin/env node
/**
 * publish-post.js — MedCrivo Instagram Publisher
 * Uso: node publish-post.js <slot-id>
 * Exemplo: node publish-post.js e1-static
 *
 * Fluxo: lê manifest.json do slot → cria container via Composio → publica
 * Composio account: instagram_eliza-carry (@medcrivo, id: 28501782156184932)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const IG_USER_ID = '28501782156184932';
const SLOTS_DIR = path.join(__dirname, '..', 'assets', 'posts');

function apiCall(toolSlug, args) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      tools: [{ tool_slug: toolSlug, arguments: args, account: 'instagram_eliza-carry' }],
      thought: `Publishing for @medcrivo: ${toolSlug}`,
      sync_response_to_workbench: false,
      current_step: toolSlug,
      current_step_metric: '1/1'
    });

    const options = {
      hostname: 'connect.composio.dev',
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function publishPost(slotId) {
  const manifestPath = path.join(SLOTS_DIR, slotId, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`ERRO: manifest.json não encontrado em ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`[publish] Slot: ${slotId} | Tipo: ${manifest.type} | Data: ${manifest.scheduled_at}`);

  if (!manifest.approved) {
    console.error('BLOQUEADO: manifest.approved = false. Rafael deve aprovar antes de publicar.');
    process.exit(1);
  }

  if (manifest.type === 'static') {
    // Post estático: uma imagem
    console.log('[publish] Criando container de imagem...');
    const res = await apiCall('INSTAGRAM_POST_IG_USER_MEDIA', {
      ig_user_id: IG_USER_ID,
      image_url: manifest.image_url,
      caption: manifest.caption
    });
    console.log('[publish] Container:', JSON.stringify(res).slice(0, 300));

    const creationId = res?.data?.results?.[0]?.response?.data?.id;
    if (!creationId) throw new Error('creation_id não encontrado');

    console.log(`[publish] Publicando container ${creationId}...`);
    const pub = await apiCall('INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH', {
      ig_user_id: IG_USER_ID,
      creation_id: creationId,
      max_wait_seconds: 60
    });
    console.log('[publish] ✅ Publicado:', JSON.stringify(pub).slice(0, 300));

  } else if (manifest.type === 'carousel') {
    // Carrossel: múltiplas imagens
    console.log(`[publish] Criando ${manifest.image_urls.length} containers filhos...`);
    const childIds = [];
    for (const url of manifest.image_urls) {
      const res = await apiCall('INSTAGRAM_POST_IG_USER_MEDIA', {
        ig_user_id: IG_USER_ID,
        image_url: url,
        is_carousel_item: true
      });
      const cid = res?.data?.results?.[0]?.response?.data?.id;
      if (!cid) throw new Error(`Filho não criado para ${url}`);
      childIds.push(cid);
      console.log(`  filho: ${cid}`);
      await new Promise(r => setTimeout(r, 1500)); // rate limit
    }

    console.log('[publish] Criando container pai do carrossel...');
    const parent = await apiCall('INSTAGRAM_CREATE_CAROUSEL_CONTAINER', {
      ig_user_id: IG_USER_ID,
      children: childIds,
      caption: manifest.caption
    });
    const parentId = parent?.data?.results?.[0]?.response?.data?.id;
    if (!parentId) throw new Error('parent_id não encontrado');

    console.log(`[publish] Publicando carrossel ${parentId}...`);
    const pub = await apiCall('INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH', {
      ig_user_id: IG_USER_ID,
      creation_id: parentId,
      max_wait_seconds: 60
    });
    console.log('[publish] ✅ Carrossel publicado:', JSON.stringify(pub).slice(0, 300));
  }
}

const slotId = process.argv[2];
if (!slotId) {
  console.error('Uso: node publish-post.js <slot-id>');
  process.exit(1);
}

publishPost(slotId).catch(e => {
  console.error('[publish] ERRO:', e.message);
  process.exit(1);
});
