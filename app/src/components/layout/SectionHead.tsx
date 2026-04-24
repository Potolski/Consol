import { PoolverMark } from "@/components/brand/PoolverLogo";

interface SectionHeadProps {
  n: string;
  title: string;
  meta: string;
}

export function SectionHead({ n, title, meta }: SectionHeadProps) {
  return (
    <div className="section-head">
      <span className="section-num">
        <PoolverMark size={12} />
        {n}
      </span>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      <span className="section-meta">{meta}</span>
    </div>
  );
}
