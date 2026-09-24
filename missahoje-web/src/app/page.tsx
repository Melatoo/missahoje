export default function Home() {
  return (
    <section aria-labelledby="missas-de-hoje" className="flex flex-col gap-4">
      <h1 id="missas-de-hoje" className="text-2xl font-semibold tracking-tight">
        Missas de hoje
      </h1>
      <p className="rounded-2xl bg-surface p-5 text-sm text-muted-foreground">
        Escolha uma cidade para ver os horários.
      </p>
    </section>
  );
}
