import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedInitialData() {
  const productsSnap = await getDocs(collection(db, 'products'));
  if (productsSnap.size > 0) return;

  const demoProducts = [
    {
      nameAr: 'عسل سدر ملكي - وادي دوعن',
      nameEn: 'Royal Sidr Honey - Doan Valley',
      descriptionAr: 'عسل سدر طبيعي 100%، مستخلص من أشجار السدر العريقة في قلب حضرموت. يتميز بكثافته العالية وطعمه الفريد.',
      descriptionEn: '100% natural Sidr honey, extracted from ancient Sidr trees in the heart of Hadramout. High density and unique taste.',
      category: 'honey',
      regionId: 'hadramout',
      producerId: 'demo-producer-1',
      price: 120,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
      audioStoryUrl: 'https://example.com/story1.mp3',
      qualityStatus: 'gold',
      stock: 50,
      tags: ['عضوي', 'ملك', 'حضرموت'],
      createdAt: new Date().toISOString(),
    },
    {
      nameAr: 'بن خولاني صعدة - محمص وسط',
      nameEn: 'Khoulani Coffee - Medium Roast',
      descriptionAr: 'من جبال صعدة الشاهقة، بن خولاني أصيل معالج بالطريقة الطبيعية. يتميز بنكهة الفواكه والشكولاتة.',
      descriptionEn: 'From the high mountains of Saada, authentic Khoulani coffee processed naturally. Fruity and chocolate notes.',
      category: 'coffee',
      regionId: 'saada',
      producerId: 'demo-producer-2',
      price: 45,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      audioStoryUrl: 'https://example.com/story2.mp3',
      qualityStatus: 'silver',
      stock: 100,
      tags: ['بن', 'خولاني', 'صعدة'],
      createdAt: new Date().toISOString(),
    },
    {
      nameAr: 'بخور تعزي ملكي',
      nameEn: 'Royal Taiz Incense',
      descriptionAr: 'بخور يمني أصيل مصنوع يدوياً من خلطات سرية توارثتها الأجيال في مدينة تعز.',
      descriptionEn: 'Authentic Yemeni incense handmade from secret blends inherited through generations in Taiz.',
      category: 'incense',
      regionId: 'taiz',
      producerId: 'demo-producer-3',
      price: 35,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1602131920703-9d4f0cc97c9b?auto=format&fit=crop&q=80&w=800',
      audioStoryUrl: 'https://example.com/story3.mp3',
      qualityStatus: 'gold',
      stock: 30,
      tags: ['بخور', 'تعز', 'رائحة'],
      createdAt: new Date().toISOString(),
    },
    {
      nameAr: 'مشجر تهامي يدوي',
      nameEn: 'Handmade Tihami Textile',
      descriptionAr: 'منسوجات قطنية ملونة بأصباغ طبيعية، تعبر عن تراث سهل تهامة العريق.',
      descriptionEn: 'Cotton textiles colored with natural dyes, expressing the ancient heritage of the Tihama plain.',
      category: 'textiles',
      regionId: 'tihama',
      producerId: 'demo-producer-4',
      price: 80,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1528642463344-93881dfdf2b8?auto=format&fit=crop&q=80&w=800',
      audioStoryUrl: 'https://example.com/story4.mp3',
      qualityStatus: 'silver',
      stock: 15,
      tags: ['منسوجات', 'تهامة', 'يدوي'],
      createdAt: new Date().toISOString(),
    }
  ];

  for (const p of demoProducts) {
    await addDoc(collection(db, 'products'), p);
  }

  // Seed Regions
  const regions = [
    { id: 'hadramout', nameAr: 'حضرموت', nameEn: 'Hadramout', descriptionAr: 'أرض اللبان والعسل الفاخر.', descriptionEn: 'Land of frankincense and luxury honey.' },
    { id: 'taiz', nameAr: 'تعز', nameEn: 'Taiz', descriptionAr: 'عاصمة الثقافة والبخور.', descriptionEn: 'Capital of culture and incense.' },
    { id: 'saada', nameAr: 'صعدة', nameEn: 'Saada', descriptionAr: 'موطن أجود أنواع البن.', descriptionEn: 'Home to the finest coffee.' },
    { id: 'tihama', nameAr: 'تهامة', nameEn: 'Tihama', descriptionAr: 'تراث الألوان والبساطة.', descriptionEn: 'Heritage of colors and simplicity.' },
  ];

  for (const r of regions) {
    await setDoc(doc(db, 'regions', r.id), r);
  }
}
