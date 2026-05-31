import { Heading, PricingWrapper, Price, Paragraph } from "@/components/ui/aniamted-pricing-cards";

export default function DemoOne() {
  return <div className={' h-[600px] w-full flex gap-12 items-center justify-center'}>

    <PricingWrapper contactHref={'/'} type={'crosses'} className={'bg-indigo-500'}>

      <Heading>website</Heading>

      <Price>

        $5000

        <br />

        /mo

      </Price>

      <Paragraph>

        Special Web Site for you made with Next.js, TailwindCSS and FramerMotion.

      </Paragraph>

    </PricingWrapper>

  </div>
}
