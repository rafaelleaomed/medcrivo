"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";
import { MEDCRIVO_FOLDER_ART } from "@/components/ui/medcrivo-folder-art";
import { TOOL_GROUPS, toolsInGroup, type ToolGroup } from "@/config/tools";

/** Largura da pasta acompanha a célula (até 340px, o tamanho de desenho do componente). */
function useCellWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function ToolFolder({ group, index }: { group: ToolGroup; index: number }) {
  const router = useRouter();
  const { ref, width } = useCellWidth<HTMLDivElement>();
  const tools = toolsInGroup(group.id);
  const files: FolderFile[] = tools.map((t) => ({
    name: t.label,
    meta: t.status === "pronto" ? t.hint : "Em breve",
  }));
  const ready = tools.filter((t) => t.status === "pronto").length;
  const folderWidth = Math.min(340, Math.max(220, width - 8));

  return (
    <div className="mc-cell flex flex-col items-center gap-16 px-4 pb-8 pt-6 sm:px-6">
      <div className="flex w-full items-center justify-between">
        <span className="mc-kicker">{String(index + 1).padStart(2, "0")}</span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--text-muted)]">
          {ready}/{tools.length}
        </span>
      </div>
      <div ref={ref} className="flex w-full justify-center">
        {width > 0 && (
          <GlassFolder
            label={group.label}
            meta={`${tools.length} ferramentas`}
            tone={group.tone}
            art={MEDCRIVO_FOLDER_ART[group.art]}
            seed={7 + index * 5}
            files={files}
            action="none"
            maxVisible={tools.length}
            width={folderWidth}
            appearDelay={index * 140}
            // Arquivos sem href viram botões: a navegação fica no cliente, sem recarregar a página.
            onFileSelect={(_, i) => router.push(tools[i].href)}
          />
        )}
      </div>
    </div>
  );
}

/** As ferramentas do estúdio em três pastas de vidro: Criar, Planejar e Revisar. */
export function ToolFolders() {
  return (
    <div className="mc-grid grid-cols-1 border-t-0 md:grid-cols-3">
      {TOOL_GROUPS.map((group, i) => (
        <ToolFolder key={group.id} group={group} index={i} />
      ))}
    </div>
  );
}
