import Image from "next/image";

export function QuadraBackdrop({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/marca/planalto_quadra.png"
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
