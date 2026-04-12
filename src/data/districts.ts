export interface District {
  name_bn: string;
  name_en: string;
}

export interface Division {
  name_bn: string;
  name_en: string;
  districts: District[];
}

export const divisions: Division[] = [
  {
    name_bn: 'ঢাকা', name_en: 'Dhaka',
    districts: [
      { name_bn: 'ঢাকা', name_en: 'Dhaka' },
      { name_bn: 'গাজীপুর', name_en: 'Gazipur' },
      { name_bn: 'নারায়ণগঞ্জ', name_en: 'Narayanganj' },
      { name_bn: 'টাঙ্গাইল', name_en: 'Tangail' },
      { name_bn: 'কিশোরগঞ্জ', name_en: 'Kishoreganj' },
      { name_bn: 'মানিকগঞ্জ', name_en: 'Manikganj' },
      { name_bn: 'মুন্সীগঞ্জ', name_en: 'Munshiganj' },
      { name_bn: 'নরসিংদী', name_en: 'Narsingdi' },
      { name_bn: 'ফরিদপুর', name_en: 'Faridpur' },
      { name_bn: 'গোপালগঞ্জ', name_en: 'Gopalganj' },
      { name_bn: 'মাদারীপুর', name_en: 'Madaripur' },
      { name_bn: 'রাজবাড়ী', name_en: 'Rajbari' },
      { name_bn: 'শরীয়তপুর', name_en: 'Shariatpur' },
    ],
  },
  {
    name_bn: 'চট্টগ্রাম', name_en: 'Chittagong',
    districts: [
      { name_bn: 'চট্টগ্রাম', name_en: 'Chittagong' },
      { name_bn: 'কক্সবাজার', name_en: "Cox's Bazar" },
      { name_bn: 'কুমিল্লা', name_en: 'Comilla' },
      { name_bn: 'ফেনী', name_en: 'Feni' },
      { name_bn: 'ব্রাহ্মণবাড়িয়া', name_en: 'Brahmanbaria' },
      { name_bn: 'রাঙ্গামাটি', name_en: 'Rangamati' },
      { name_bn: 'খাগড়াছড়ি', name_en: 'Khagrachhari' },
      { name_bn: 'বান্দরবান', name_en: 'Bandarban' },
      { name_bn: 'নোয়াখালী', name_en: 'Noakhali' },
      { name_bn: 'লক্ষ্মীপুর', name_en: 'Lakshmipur' },
      { name_bn: 'চাঁদপুর', name_en: 'Chandpur' },
    ],
  },
  {
    name_bn: 'রাজশাহী', name_en: 'Rajshahi',
    districts: [
      { name_bn: 'রাজশাহী', name_en: 'Rajshahi' },
      { name_bn: 'নওগাঁ', name_en: 'Naogaon' },
      { name_bn: 'নাটোর', name_en: 'Natore' },
      { name_bn: 'চাঁপাইনবাবগঞ্জ', name_en: 'Chapainawabganj' },
      { name_bn: 'পাবনা', name_en: 'Pabna' },
      { name_bn: 'সিরাজগঞ্জ', name_en: 'Sirajganj' },
      { name_bn: 'বগুড়া', name_en: 'Bogra' },
      { name_bn: 'জয়পুরহাট', name_en: 'Joypurhat' },
    ],
  },
  {
    name_bn: 'খুলনা', name_en: 'Khulna',
    districts: [
      { name_bn: 'খুলনা', name_en: 'Khulna' },
      { name_bn: 'যশোর', name_en: 'Jessore' },
      { name_bn: 'সাতক্ষীরা', name_en: 'Satkhira' },
      { name_bn: 'মেহেরপুর', name_en: 'Meherpur' },
      { name_bn: 'নড়াইল', name_en: 'Narail' },
      { name_bn: 'কুষ্টিয়া', name_en: 'Kushtia' },
      { name_bn: 'মাগুরা', name_en: 'Magura' },
      { name_bn: 'ঝিনাইদহ', name_en: 'Jhenaidah' },
      { name_bn: 'চুয়াডাঙ্গা', name_en: 'Chuadanga' },
      { name_bn: 'বাগেরহাট', name_en: 'Bagerhat' },
    ],
  },
  {
    name_bn: 'বরিশাল', name_en: 'Barisal',
    districts: [
      { name_bn: 'বরিশাল', name_en: 'Barisal' },
      { name_bn: 'পটুয়াখালী', name_en: 'Patuakhali' },
      { name_bn: 'ভোলা', name_en: 'Bhola' },
      { name_bn: 'পিরোজপুর', name_en: 'Pirojpur' },
      { name_bn: 'ঝালকাঠি', name_en: 'Jhalokati' },
      { name_bn: 'বরগুনা', name_en: 'Barguna' },
    ],
  },
  {
    name_bn: 'সিলেট', name_en: 'Sylhet',
    districts: [
      { name_bn: 'সিলেট', name_en: 'Sylhet' },
      { name_bn: 'মৌলভীবাজার', name_en: 'Moulvibazar' },
      { name_bn: 'হবিগঞ্জ', name_en: 'Habiganj' },
      { name_bn: 'সুনামগঞ্জ', name_en: 'Sunamganj' },
    ],
  },
  {
    name_bn: 'রংপুর', name_en: 'Rangpur',
    districts: [
      { name_bn: 'রংপুর', name_en: 'Rangpur' },
      { name_bn: 'দিনাজপুর', name_en: 'Dinajpur' },
      { name_bn: 'কুড়িগ্রাম', name_en: 'Kurigram' },
      { name_bn: 'লালমনিরহাট', name_en: 'Lalmonirhat' },
      { name_bn: 'নীলফামারী', name_en: 'Nilphamari' },
      { name_bn: 'গাইবান্ধা', name_en: 'Gaibandha' },
      { name_bn: 'ঠাকুরগাঁও', name_en: 'Thakurgaon' },
      { name_bn: 'পঞ্চগড়', name_en: 'Panchagarh' },
    ],
  },
  {
    name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh',
    districts: [
      { name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh' },
      { name_bn: 'জামালপুর', name_en: 'Jamalpur' },
      { name_bn: 'নেত্রকোনা', name_en: 'Netrokona' },
      { name_bn: 'শেরপুর', name_en: 'Sherpur' },
    ],
  },
];

// Flat list of all districts
export const allDistricts: District[] = divisions.flatMap(d => d.districts);
