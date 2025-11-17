import { Hero } from "@/components/home/hero"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedJobs } from "@/components/home/featured-jobs"
import { HowItWorks } from "@/components/home/how-it-works"
import { CommunityStats } from "@/components/home/community-stats"
import { Testimonials } from "@/components/home/testimonials"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedCategories />
      <HowItWorks />
      <FeaturedJobs />
      <CommunityStats />
      <Testimonials />
      <CTASection />
    </main>
  )
}
