import Hero from "@/components/marketing/Hero";
import BookingForm from "@/components/marketing/BookingForm";
import WhyChooseUs from "@/components/marketing/WhyChooseUs";
import ServiceAreas from "@/components/marketing/ServiceAreas";
import Testimonials from "@/components/marketing/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <BookingForm />
      <WhyChooseUs />
      <ServiceAreas />
      <Testimonials />
    </>
  );
}
