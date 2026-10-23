import type { Metadata } from "next";
import ContactForm from "@/app/components/forms/ContactForm";
import { store } from "@/app/components/layout/Footer";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/app/components/icons";

export const metadata: Metadata = {
  title: "Liên hệ",
};

export default function ContactPage() {
  const query = encodeURIComponent(store.address);
  // Google Maps embed without an API key.
  const mapEmbedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-12">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <div>
          <h1 className="text-3xl font-semibold">Liên hệ</h1>
          <p className="mt-3 text-muted">
            Bạn có câu hỏi về đơn hàng, đổi trả hay sản phẩm? Hãy gọi hoặc gửi tin nhắn, đội ngũ của chúng tôi sẽ hỗ trợ bạn.
          </p>

          <a
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="mt-6 flex items-center gap-3 border border-border p-4 hover:border-foreground"
          >
            <PhoneIcon size={24} className="shrink-0" />
            <span>
              <span className="block text-sm text-muted">Hotline</span>
              <span className="block text-xl font-semibold">{store.phone}</span>
            </span>
          </a>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="flex items-center gap-2 font-semibold">
                <MapPinIcon size={16} className="shrink-0" />
                Địa chỉ cửa hàng
              </dt>
              <dd className="mt-1 text-muted">{store.address}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold">
                <MailIcon size={16} className="shrink-0" />
                Email
              </dt>
              <dd className="mt-1 text-muted">
                <a href={`mailto:${store.email}`} className="hover:text-foreground hover:underline">
                  {store.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Giờ hỗ trợ khách hàng</dt>
              <dd className="mt-1 text-muted">Thứ Hai – Thứ Sáu, 8:00 – 20:00</dd>
            </div>
            <div>
              <dt className="font-semibold">Chương trình khuyến mãi</dt>
              <dd className="mt-1 text-muted">
                Ưu đãi mùa thu: giảm 50% cho đơn hàng, áp dụng cả sản phẩm đang giảm giá. Không áp dụng cho thẻ quà tặng và một số sản phẩm.
              </dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>

      <section aria-labelledby="map" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="map" className="text-2xl font-semibold">Bản đồ</h2>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            Chỉ đường trên Google Maps
          </a>
        </div>
        <iframe
          src={mapEmbedUrl}
          title={`Bản đồ: ${store.address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-4 aspect-[4/3] w-full border border-border md:aspect-[16/7]"
        />
      </section>
    </div>
  );
}
