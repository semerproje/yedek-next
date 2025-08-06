import Link from "next/link";

const programs = [
  {
    id: 1,
    title: "Gündem Analizi",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
    time: "Hafta içi 20:00 - 21:00",
    url: "/program/gundem-analizi",
  },
  {
    id: 2,
    title: "Ekonomi Saati",
    image:
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=400&q=80",
    time: "Hafta içi 18:00 - 19:00",
    url: "/program/ekonomi-saati",
  },
  {
    id: 3,
    title: "Siyaset Arenası",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    time: "Hafta içi 22:00 - 23:00",
    url: "/program/siyaset-arenasi",
  },
  {
    id: 4,
    title: "Dış Politika Özel",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
    time: "Pazar 21:00 - 22:00",
    url: "/program/dis-politika-ozel",
  },
];

export default function NewsProgramsGrid() {
  return (
    <section className="container mx-auto px-4 mb-10 max-w-[1530px]">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-wide">
        Haber Programları
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={program.url}
            className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition hover:shadow-2xl"
            aria-label={`Program: ${program.title}`}
          >
            <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {program.title}
              </h3>
              <p className="text-sm text-gray-600 mt-auto">{program.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
