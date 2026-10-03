import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function IgrejaNotFound() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Igreja não encontrada</h1>
      <p className="text-muted-foreground">O link pode estar errado ou a igreja foi removida.</p>
      <Button asChild>
        <Link href="/">Ver missas de hoje</Link>
      </Button>
    </section>
  );
}
