// Parse folder name to extract property details
const parsePropertyFromFolderName = (folderName: string) => {
  const name = folderName.toLowerCase();
  
  // Extract BHK
  const bhkMatch = name.match(/(\d+)\s*bhk/);
  const bhk = bhkMatch ? `${bhkMatch[1]} BHK` : null;
  
  // Extract area (sqyd or sqyd)
  const areaMatch = name.match(/(\d+)\s*(sqyd|sq\s*yd|sqft|sq\s*ft)/);
  const area = areaMatch ? `${areaMatch[1]} ${areaMatch[2].toUpperCase()}` : null;
  
  // Extract price (lakh)
  const priceMatch = name.match(/(\d+\.?\d*)\s*lakh/i);
  const priceInLakh = priceMatch ? parseFloat(priceMatch[1]) : null;
  const price = priceInLakh ? priceInLakh * 100000 : null;
  
  // Extract sector
  const sectorMatch = name.match(/sector\s*(\d+)/i);
  const sector = sectorMatch ? `Sector ${sectorMatch[1]}` : null;
  
  // Extract floor
  let floor = null;
  if (name.includes('ground floor') || name.includes('g floor')) {
    floor = 'Ground Floor';
  } else if (name.includes('1st floor') || name.includes('first floor')) {
    floor = '1st Floor';
  } else if (name.includes('top')) {
    floor = 'Top Floor';
  }
  
  // Extract city/location
  let city = 'Mohali';
  let locality = sector || '';
  
  if (name.includes('kurali')) {
    city = 'Kurali';
  } else if (name.includes('kharar')) {
    city = 'Kharar';
  } else if (name.includes('sector 127')) {
    locality = 'Sector 127';
    city = 'Mohali';
  } else if (name.includes('sector 115')) {
    locality = 'Sector 115';
    city = 'Kharar';
  }
  
  // Extract property type
  let propertyType = 'Independent House/Villa';
  if (name.includes('kothi')) {
    propertyType = 'Independent House/Villa';
  } else if (name.includes('house')) {
    propertyType = 'Independent House/Villa';
  }
  
  // Get images from folder
  const getImages = (folderName: string): string[] => {
    const images: string[] = [];
    // Screenshot images are numbered, get first 20
    // Note: Folder names might have special characters, so we need to handle encoding
    const encodedFolderName = folderName.replace(/\s+/g, '%20'); // Replace spaces with %20
    for (let i = 1; i <= 20; i++) {
      images.push(`/Static data property/${encodedFolderName}/Screenshot_${i}.png`);
    }
    return images;
  };
  
  return {
    folderName,
    bhk,
    area,
    price,
    priceDisplay: priceInLakh ? `₹${priceInLakh} Lakh` : null,
    sector,
    floor,
    city,
    locality,
    propertyType,
    images: getImages(folderName),
    title: folderName,
  };
};

// Static properties from folders
export const getStaticProperties = () => {
  const folders = [
    '109 sqyd 4 BHK KOTHI 95 lakh Sector 127 Shivalik home 2',
    '114 sqyd 2bhk On kurali highway Near mind tree school 51.90 lakh top 52.90 lakh 1st 53.90 lakh g floor',
    '2 BHK 100 SQYD ONLY GROUND FLOOR 38.90 LAKH SECTOR 127 NEAR DEV HOME',
    '2 BHK 1ST FLOOR 42.90 LAKH SECTOR 127 SHIVALIK GREEN',
    '2 BHK 44.90 LAKH 105 SQYD 46.90 LAKH 113 SQYD SECTOR 115 KHARAR LANDRAN HIGHWAY',
    '92 SQD 3 BHK House 72.90 Lakh Oppposite rangai fram Eden city road',
  ];
  
  const staticProps = folders.map((folder, index) => {
    const parsed = parsePropertyFromFolderName(folder);
    const property = {
      id: `static-${index + 1}`,
      property_type: parsed.propertyType,
      posting_type: 'Sell',
      property_title: parsed.title,
      title: parsed.title, // Also add as title for compatibility
      description: `${parsed.bhk || ''} ${parsed.propertyType} in ${parsed.locality || parsed.city}. ${parsed.area ? `Area: ${parsed.area}.` : ''} ${parsed.floor ? `Floor: ${parsed.floor}.` : ''} ${parsed.priceDisplay ? `Price: ${parsed.priceDisplay}` : ''}`,
      bhk_type: parsed.bhk || '',
      price: parsed.price?.toString() || '0',
      city: parsed.city,
      locality: parsed.locality || parsed.city,
      main_image: parsed.images[0] || '/assets/hero.jpg',
      primary_image: parsed.images[0] || '/assets/hero.jpg',
      other_images: parsed.images.slice(1).join(','),
      status: 'Approved',
      created_at: new Date().toISOString(),
      // Additional fields
      property_status: 'Ready to Move',
      furnishing_type: 'Unfurnished',
      amenities: [],
      furnishings: [],
      owner_name: 'Property Owner',
      owner_mobile: '+919999999999',
    };
    
    console.log(`Static Property ${index + 1}:`, property);
    return property;
  });
  
  console.log('Total Static Properties:', staticProps.length);
  return staticProps;
};

