import Image from "next/image";
import { cn } from "@/shared/utils/cn";

export function QuadraBackdrop({
  children,
  semRolagem = false,
}: {
  children: React.ReactNode;
  semRolagem?: boolean;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col",
        semRolagem ? "h-screen overflow-hidden" : "min-h-screen",
      )}
    >
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/marca/fundo-tela-novo-planalto.jpg"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      {children}
    </div>
  );
}
