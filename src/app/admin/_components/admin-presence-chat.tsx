"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Circle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  heartbeatAction,
  listarMensagensAction,
  enviarMensagemAction,
  type AdminOnline,
  type MensagemChatView,
} from "./presence-chat.actions";

const HEARTBEAT_MS = 20_000;
const POLL_MENSAGENS_MS = 5_000;

const CORES_AVATAR = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#9085e9", "#e66767"];

function corParaId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % CORES_AVATAR.length;
  return CORES_AVATAR[hash] ?? "#3987e5";
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeiras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return primeiras.join("") || "?";
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ userId, nome, size = 32 }: { userId: string; nome: string; size?: number }): React.ReactElement {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: corParaId(userId), width: size, height: size, fontSize: size * 0.4 }}
    >
      {iniciais(nome)}
    </span>
  );
}

export function AdminPresenceChat(): React.ReactElement | null {
  const [meuId, setMeuId] = useState<string | null>(null);
  const [online, setOnline] = useState<AdminOnline[]>([]);
  const [mensagens, setMensagens] = useState<MensagemChatView[]>([]);
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ultimaContagemVista = useRef(0);
  const tituloOriginal = useRef<string | null>(null);
  const flashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function heartbeat(): Promise<void> {
      const resultado = await heartbeatAction();
      if (cancelado || resultado.error || !resultado.meuId) return;
      setMeuId(resultado.meuId);
      setOnline(resultado.online);
    }

    heartbeat();
    const intervalo = setInterval(heartbeat, HEARTBEAT_MS);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function carregar(): Promise<void> {
      const resultado = await listarMensagensAction();
      if (cancelado || resultado.error) return;
      setMensagens(resultado.mensagens);
      if (!aberto) {
        setNaoLidas(Math.max(0, resultado.mensagens.length - ultimaContagemVista.current));
      }
    }

    carregar();
    const intervalo = setInterval(carregar, POLL_MENSAGENS_MS);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [aberto]);

  useEffect(() => {
    if (aberto) {
      ultimaContagemVista.current = mensagens.length;
      setNaoLidas(0);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [aberto, mensagens.length]);

  function pararFlashTitulo(): void {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (tituloOriginal.current) {
      document.title = tituloOriginal.current;
    }
  }

  useEffect(() => {
    function handleFoco(): void {
      if (document.visibilityState === "visible") pararFlashTitulo();
    }
    window.addEventListener("focus", handleFoco);
    document.addEventListener("visibilitychange", handleFoco);
    return () => {
      window.removeEventListener("focus", handleFoco);
      document.removeEventListener("visibilitychange", handleFoco);
      pararFlashTitulo();
    };
  }, []);

  useEffect(() => {
    if (naoLidas > 0 && !aberto && !document.hasFocus()) {
      if (!tituloOriginal.current) tituloOriginal.current = document.title;

      if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
      let mostrandoAviso = false;
      flashIntervalRef.current = setInterval(() => {
        mostrandoAviso = !mostrandoAviso;
        document.title = mostrandoAviso
          ? `(${naoLidas}) Nova mensagem`
          : (tituloOriginal.current ?? document.title);
      }, 1000);
    } else {
      pararFlashTitulo();
    }
  }, [naoLidas, aberto]);

  async function handleEnviar(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const texto2 = texto.trim();
    if (!texto2 || enviando) return;

    setEnviando(true);
    setTexto("");
    const resultado = await enviarMensagemAction(texto2);
    if (!resultado.error) {
      const atualizado = await listarMensagensAction();
      if (!atualizado.error) {
        setMensagens(atualizado.mensagens);
        ultimaContagemVista.current = atualizado.mensagens.length;
      }
    }
    setEnviando(false);
  }

  const outrosOnline = online.filter((admin) => admin.userId !== meuId);

  return (
    <div className="fixed bottom-16 right-5 z-30 flex flex-col items-end gap-3">
      {aberto ? (
        <div className="flex h-[28rem] w-80 flex-col overflow-hidden rounded-lg border border-white/10 bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-heading text-sm font-bold text-planalto-white">Chat da Diretoria</p>
              <p className="text-xs text-planalto-gray">
                {outrosOnline.length > 0
                  ? `${outrosOnline.length} outro(s) diretor(es) online`
                  : "Só você está online agora"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="text-planalto-gray hover:text-planalto-white"
              aria-label="Fechar chat"
            >
              <X size={18} />
            </button>
          </div>

          {online.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-2">
              {online.map((admin) => (
                <span
                  key={admin.userId}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 py-1 pl-1 pr-2 text-xs text-planalto-gray"
                >
                  <Avatar userId={admin.userId} nome={admin.nome} size={18} />
                  {admin.userId === meuId ? "Você" : admin.nome.split(" ")[0]}
                  <Circle size={7} className="fill-current text-emerald-400" />
                </span>
              ))}
            </div>
          ) : null}

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {mensagens.length === 0 ? (
              <p className="text-center text-xs text-planalto-gray">
                Nenhuma mensagem ainda. Diga oi para a diretoria!
              </p>
            ) : (
              mensagens.map((mensagem) => {
                const minha = mensagem.autorUserId === meuId;
                return (
                  <div key={mensagem.id} className={cn("flex items-end gap-2", minha && "flex-row-reverse")}>
                    <Avatar userId={mensagem.autorUserId} nome={mensagem.autorNome} size={26} />
                    <div className={cn("max-w-[70%] rounded-lg px-3 py-1.5", minha ? "bg-planalto-red" : "bg-white/10")}>
                      {!minha ? (
                        <p className="text-[11px] font-semibold text-planalto-gray">{mensagem.autorNome}</p>
                      ) : null}
                      <p className="text-sm text-white">{mensagem.texto}</p>
                      <p className="mt-0.5 text-right text-[10px] text-white/60">{formatHora(mensagem.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleEnviar} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Escreva uma mensagem..."
              maxLength={1000}
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-planalto-gray focus:outline-none focus:ring-1 focus:ring-planalto-red"
            />
            <button
              type="submit"
              disabled={enviando || !texto.trim()}
              className="rounded-md bg-planalto-red p-2 text-white disabled:opacity-40"
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-planalto-red text-white shadow-xl hover:bg-planalto-red-dark"
        aria-label="Abrir chat da diretoria"
      >
        {aberto ? <X size={22} /> : <MessageCircle size={22} />}
        {!aberto && outrosOnline.length > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            {outrosOnline.length}
          </span>
        ) : null}
        {!aberto && naoLidas > 0 ? (
          <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-planalto-red">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        ) : null}
      </button>
    </div>
  );
}
