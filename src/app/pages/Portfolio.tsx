import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Portfolio() {
  const { t } = useLanguage();

  const projects = [
    {
      id: 1,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t1.6435-9/195279237_302983011533728_7333978157360857115_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_ohc=l9kBtRf6aiQQ7kNvwHiQkq0&_nc_oc=AdqQZpLS3YIbl6eUjxdCNx8k0g0Az6bUeVa5vblUOdrLd1k2JhML_9XyegPWXpjUti5DJnCl5RcY1lwqAKZceIl8&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=rDi858o1EUja87WsgD7-yA&_nc_ss=7a3a8&oh=00_Af2vpXUlwheAbpVoUwBpqbB7hlkhEvjTr8LrS31I6yiSWA&oe=6A0D70F4',
      title: 'Anime Design Wrap',
    },
    {
      id: 2,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t1.6435-9/199515870_310747417423954_2022051910951786763_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=MuTFVRAGzaMQ7kNvwFMzyU_&_nc_oc=Adqs1ZRlgtWTwgvKOHNSoYs_NRuXNYrGam0B2aVZ8k1Q-elwyVraFPShvVAcTGg0SLKjqXy9uFeVBvWBLYzLWsXY&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=y_aLpBLIhuw7aTVrisUGgQ&_nc_ss=7a3a8&oh=00_Af2WGUzRRSYo7vZ8X-apOeNeHzl79Xdxb_wxqP-ogcuvUw&oe=6A0D81C9',
      title: 'Color Change Project',
    },
    {
      id: 3,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t1.6435-9/199703014_311081777390518_1302423269596562583_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f798df&_nc_ohc=pueDBcq8LQkQ7kNvwGHxaSW&_nc_oc=AdoIFHopAbeLupS1Gs_x2jF7_PahMxDhWiU_eM2Kfv3u8vfDRQIONlrXwAMJbWLN4CZ3Unkkk0nMF_aTIJn13auO&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=MKPMPjjs2hxHCbFy5dOC0g&_nc_ss=7a3a8&oh=00_Af1CfgHNWtzCJ8czs_PsSFv03xCNzUhNS5hN4s5tFRYfaw&oe=6A0D92A6',
      title: 'Custom Graphics',
    },
    {
      id: 4,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t1.6435-9/207128506_320199166478779_713628242275597041_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=QkelROPQgf8Q7kNvwF2ZbJd&_nc_oc=AdqrtF1JSyMyfvoBK5G5LhIU_DrXN6gzkPc9SSkRAryOyI9ESfOTLXFtErNudiHRi9QQw5stMT8r5jiI-o1_lowd&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=QwAfVVBkE3PoLBkii_EyCg&_nc_ss=7a3a8&oh=00_Af3BsFiX4pBiiET2q4Z-_57oiFpCx4DENwP_0bsQwCv6Ew&oe=6A0D9296',
      title: 'Camouflage Wrap',
    },
    {
      id: 5,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t39.30808-6/467218986_1099480348550653_3215334907077526323_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=jXk3iGYTkwQQ7kNvwEBDzBx&_nc_oc=AdqFSX8eetqX7Fvvywo8NR6LJiIUJoT6-_N3TRmI_IOxFgLwE85xQG2IhJ7MjarM-VDguWW5lL9XpG3hXxGBh36W&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=HqZ53HTY09gRgh2TQxg1XA&_nc_ss=7a3a8&oh=00_Af0o8o-9bdkiKjVryiMmVdY_GiEAmPkyUw5MoiyWK5LMOQ&oe=69EBE858',
      title: 'Geometric Design',
    },
    {
      id: 6,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t39.30808-6/475186786_1149462353552452_8770906235860267957_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=IUd_reuKdUUQ7kNvwFpC7Qc&_nc_oc=AdqCDUJMAoef-jtnqr0ToK679z6XbeEZmckJgYuozOb1chKCwjgjYJru9Wi8Ieh90OpEQg-3O9K2igD4zJ7sHdUu&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=V7pNJXqJ4OKcuPCKrqnc7Q&_nc_ss=7a3a8&oh=00_Af1vJAD7DDvbeB_PcuHmzauOcNgzItVgYPRsevM_ffV09g&oe=69EBDE4C',
      title: 'Comic Wrap',
    },
    {
      id: 7,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t39.30808-6/469909069_1116011383564216_4018840555343109819_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=bUjaWUII2r0Q7kNvwFKgUw1&_nc_oc=AdqXGWwo7wjWHPEx0b98Tie6TSWS0n-mcWaEJCJJfMa1Sxph2ByVjJ8YEs52_JdOYzwzCVOZnEn56E2XjpnIdctM&_nc_zt=23&_nc_ht=scontent.famm5-1.fna&_nc_gid=KDDHIK5FtDEk-pYV_g4PXQ&_nc_ss=7a3a8&oh=00_Af07pNjFFBpckO1HSePyIwQJ5qIrn54E7HEp4lnAHcKq5Q&oe=69EBC7A8',
      title: 'Hearts Design',
    },
    {
      id: 8,
      image: 'https://scontent.famm5-1.fna.fbcdn.net/v/t51.82787-15/529608610_18518384794062834_5038585999040042613_n.jpg?stp=dst-jpegr_tt6&_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=1XCMyY4Vt2QQ7kNvwE5oumo&_nc_oc=AdpgEKAdVBWT5727hex5x84beZKWb8zEHqTBnLjsx72bi1sJ4P5LEa35AitPqE_jo6A81X0jSulyTCNqYzgnVDUn&_nc_zt=23&se=-1&_nc_ht=scontent.famm5-1.fna&_nc_gid=6aY8CCouFGi5J1mukZ0JRw&_nc_ss=7a389&oh=00_Af3BATetXeTb4uPeVVwOZHf9XzsiNQ37JL6gXo5b3dfrtw&oe=69EBFBD4',
      title: 'Matte Black Finish',
    },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl text-center mb-6">{t('portfolioTitle')}</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          {t('portfolioDesc')}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
