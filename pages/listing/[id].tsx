import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
// components
import AppHead from '@/components/atoms/AppHead';
import AppHeader from '@/components/organisms/AppHeader';
import AppFooter from '@/components/atoms/AppFooter';
import AppMap from '@/components/atoms/AppMap';
import PropertyQueryForm from '@/components/PropertyQueryForm';
import ImageGalleryModal from '@/components/ImageGalleryModal';
// icons
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TvIcon,
  WifiIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  Battery100Icon,
  BeakerIcon,
  SunIcon,
  UserGroupIcon,
  SparklesIcon,
  TruckIcon,
  CubeIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
// types
import {
  IPropertyData,
  PropertyCategory,
  PostingType,
  PropertyStatus,
  FurnishingType,
  FULLY_FURNISHED_ITEMS,
  SEMI_FURNISHED_ITEMS,
  UNFURNISHED_ITEMS,
} from '../../typings/PropertyTypes';

// Mock data - future me API se aayega
const getListingData = (id: string): IPropertyData => {
  return {
    id: id,
    propertyCategory: PropertyCategory.FLAT_APARTMENT,
    postingType: PostingType.RENT,
    propertyTitle: 'Spacious 3 BHK Flat in Prime Location',
    description:
      'Beautiful 3 BHK flat available for rent in a well-maintained society. The property features modern amenities, spacious rooms, and excellent connectivity. Perfect for families looking for a comfortable living space.',
    bhkType: '3 BHK' as any,
    price: 25000,
    maintenanceCharges: 3000,
    builtUpArea: 1800,
    carpetArea: 1500,
    propertyAge: 5,
    propertyStatus: PropertyStatus.READY_TO_MOVE,
    totalFloors: 10,
    yourFloor: 5,
    facingDirection: 'East' as any,
    location: {
      city: 'Chandigarh',
      locality: 'Sector 15',
      societyName: 'Green Valley Apartments',
      landmark: 'Near Sector 15 Market',
      pincode: '160015',
      googleMapLink: 'https://maps.google.com/...',
      coordinates: {
        lat: 30.7333,
        long: 76.7794,
      },
    },
    furnishingType: FurnishingType.FULLY_FURNISHED,
    furnishingItems: FULLY_FURNISHED_ITEMS,
    societyAmenities: [
      'Lift' as any,
      'Security Guard' as any,
      'CCTV' as any,
      'Power Backup' as any,
      'Gym' as any,
      'Swimming Pool' as any,
      'Park' as any,
      'Kids Play Area' as any,
      'Visitor Parking' as any,
    ],
    carParking: {
      type: 'Covered' as any,
      count: 2,
    },
    bikeParking: true,
    additionalRooms: ['Study Room' as any, 'Pooja Room' as any],
    legalInfo: {
      reraApproved: true,
      reraNumber: 'PBRERA-SAS81-PR0748',
      registryAvailable: true,
      loanAvailable: true,
      taxPaid: true,
    },
    images: [
      '/assets/search/1379331e-593a-4c1e-af51-222808c85a11.webp',
      '/assets/search/013c9377-349f-418b-8d4c-15f923234a5f.webp',
      '/assets/search/2dd686bc-0195-40db-a37f-8b02476415b7.webp',
      '/assets/search/44cb0de7-fa62-49e2-b4b8-68aed14373cb.webp',
      '/assets/search/97bc37a6-9a1b-4bb2-8564-771319b246fb.webp',
    ],
    videos: [],
    floorPlan: undefined,
    contact: {
      name: 'Rajesh Kumar',
      mobile: '+91 9876543210',
      whatsapp: '+91 9876543210',
      email: 'rajesh.kumar@example.com',
      isOwner: true,
    },
  };
};

const ListingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  if (!id) return null;

  const property = getListingData(id as string);

  const getFurnishingItems = () => {
    switch (property.furnishingType) {
      case FurnishingType.FULLY_FURNISHED:
        return FULLY_FURNISHED_ITEMS;
      case FurnishingType.SEMI_FURNISHED:
        return SEMI_FURNISHED_ITEMS;
      case FurnishingType.UNFURNISHED:
        return UNFURNISHED_ITEMS;
      default:
        return [];
    }
  };

  const furnishingItems = getFurnishingItems();

  // Icon mapping for furnishing items
  const getFurnishingIcon = (item: string) => {
    const iconMap: { [key: string]: any } = {
      Bed: RectangleStackIcon,
      Mattress: RectangleStackIcon,
      Sofa: HomeIcon,
      Wardrobe: CubeIcon,
      Fridge: BoltIcon,
      TV: TvIcon,
      'Washing Machine': SparklesIcon,
      'Modular Kitchen': HomeIcon,
      AC: BoltIcon,
      Geyser: FireIcon,
      Wifi: WifiIcon,
      Curtains: SunIcon,
      'Dining Table': HomeIcon,
      Microwave: BoltIcon,
      RO: BeakerIcon,
      Chimney: FireIcon,
      'Gas Stove': FireIcon,
      Lights: SunIcon,
      Fans: SparklesIcon,
      'Basic Fittings': HomeIcon,
    };
    return iconMap[item] || HomeIcon;
  };

  // Icon mapping for society amenities
  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      Lift: BuildingOfficeIcon,
      'Security Guard': ShieldCheckIcon,
      CCTV: VideoCameraIcon,
      'Power Backup': Battery100Icon,
      Gym: UserGroupIcon,
      'Swimming Pool': SparklesIcon,
      Park: SunIcon,
      'Kids Play Area': UserGroupIcon,
      'Club House': BuildingOfficeIcon,
      'Community Hall': BuildingOfficeIcon,
      'Fire Safety': FireIcon,
      'Visitor Parking': TruckIcon,
    };
    return iconMap[amenity] || HomeIcon;
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHead />
      <AppHeader />

      {/* Image Gallery */}
      <div className="mt-[86px] px-4 md:px-8 lg:px-16 py-6">
        <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[600px]">
          {/* Main Image */}
          <div className="col-span-4 md:col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden">
            <Image
              src={property.images[selectedImage]}
              alt={property.propertyTitle}
              fill
              style={{ objectFit: 'cover' }}
              className="cursor-pointer"
              onClick={() => setShowGallery(true)}
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
            >
              <HeartIcon
                className={`h-6 w-6 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </button>
            <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10">
              <ShareIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Thumbnail Images */}
          {property.images.slice(1, 5).map((img, index) => (
            <div
              key={index}
              className="relative rounded-r-2xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setSelectedImage(index + 1);
                setShowGallery(true);
              }}
            >
              <Image
                src={img}
                alt={`${property.propertyTitle} ${index + 2}`}
                fill
                style={{ objectFit: 'cover' }}
                className="group-hover:opacity-80 transition-opacity"
              />
            </div>
          ))}

          {/* Show all photos button */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-6 right-6 px-4 py-2 bg-white rounded-lg shadow-lg font-medium text-sm hover:bg-gray-50 z-10 transition-all hover:scale-105"
          >
            Show all {property.images.length} photos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Property Category & Posting Type Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {property.propertyCategory}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                For {property.postingType}
              </span>
              {property.legalInfo.reraApproved && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  RERA Approved
                </span>
              )}
            </div>

            {/* Title and Location */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{property.propertyTitle}</h1>
              <div className="flex items-center gap-2 text-base text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>
                  {property.location.locality}, {property.location.city} - {property.location.pincode}
                </span>
              </div>
              {property.location.societyName && (
                <p className="text-sm text-gray-500 mt-1">{property.location.societyName}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-primary/10 to-red-50 rounded-xl p-6 border-2 border-primary/20">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{property.price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-gray-600">
                  {property.postingType === PostingType.RENT ? '/month' : ''}
                </span>
              </div>
              {property.maintenanceCharges && (
                <p className="text-sm text-gray-600 mt-1">
                  Maintenance: ₹{property.maintenanceCharges.toLocaleString('en-IN')}/month
                </p>
              )}
            </div>

            {/* Basic Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.bhkType && (
                  <div>
                    <div className="text-sm text-gray-500">BHK Type</div>
                    <div className="font-semibold text-gray-900">{property.bhkType}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Built-up Area</div>
                  <div className="font-semibold text-gray-900">{property.builtUpArea} sq ft</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Carpet Area</div>
                  <div className="font-semibold text-gray-900">{property.carpetArea} sq ft</div>
                </div>
                {property.propertyAge && (
                  <div>
                    <div className="text-sm text-gray-500">Property Age</div>
                    <div className="font-semibold text-gray-900">{property.propertyAge} years</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-semibold text-gray-900">{property.propertyStatus}</div>
                </div>
                {property.totalFloors && (
                  <div>
                    <div className="text-sm text-gray-500">Total Floors</div>
                    <div className="font-semibold text-gray-900">{property.totalFloors}</div>
                  </div>
                )}
                {property.yourFloor && (
                  <div>
                    <div className="text-sm text-gray-500">Your Floor</div>
                    <div className="font-semibold text-gray-900">Floor {property.yourFloor}</div>
                  </div>
                )}
                {property.facingDirection && (
                  <div>
                    <div className="text-sm text-gray-500">Facing</div>
                    <div className="font-semibold text-gray-900">{property.facingDirection}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-base text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Location Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Location Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">City</div>
                    <div className="font-semibold text-gray-900">{property.location.city}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Locality / Sector</div>
                    <div className="font-semibold text-gray-900">{property.location.locality}</div>
                  </div>
                  {property.location.societyName && (
                    <div>
                      <div className="text-sm text-gray-500">Society Name</div>
                      <div className="font-semibold text-gray-900">{property.location.societyName}</div>
                    </div>
                  )}
                  {property.location.landmark && (
                    <div>
                      <div className="text-sm text-gray-500">Landmark</div>
                      <div className="font-semibold text-gray-900">{property.location.landmark}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Pincode</div>
                    <div className="font-semibold text-gray-900">{property.location.pincode}</div>
                  </div>
                </div>
                {property.location.googleMapLink && (
                  <div>
                    <a
                      href={property.location.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Furnishing Type */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Furnishing Type</h2>
              <div className="mb-4">
                <span className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium">
                  {property.furnishingType}
                </span>
              </div>
              {furnishingItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Furnishing Items Included:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {furnishingItems.map((item, index) => {
                      const Icon = getFurnishingIcon(item);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Society / Building Amenities */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Society / Building Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.societyAmenities.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parking Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Parking Details</h2>
              <div className="space-y-2">
                {property.carParking && (
                  <div>
                    <div className="text-sm text-gray-500">Car Parking</div>
                    <div className="font-semibold text-gray-900">
                      {property.carParking.count} Car(s) - {property.carParking.type}
                    </div>
                  </div>
                )}
                {property.bikeParking && (
                  <div>
                    <div className="text-sm text-gray-500">Bike Parking</div>
                    <div className="font-semibold text-gray-900">Available</div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Rooms */}
            {property.additionalRooms && property.additionalRooms.length > 0 && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Additional Rooms</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.additionalRooms.map((room, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-gray-700">{room}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Legal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {property.legalInfo.reraApproved ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">RERA Approved</div>
                    {property.legalInfo.reraNumber && (
                      <div className="text-sm text-gray-600">{property.legalInfo.reraNumber}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {property.legalInfo.registryAvailable ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div className="font-medium text-gray-900">Registry Available</div>
                </div>
                <div className="flex items-center gap-2">
                  {property.legalInfo.loanAvailable ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div className="font-medium text-gray-900">Loan Available</div>
                </div>
                <div className="flex items-center gap-2">
                  {property.legalInfo.taxPaid ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div className="font-medium text-gray-900">Tax Paid</div>
                </div>
              </div>
            </div>

            {/* Map */}
            {property.location.coordinates && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Location on Map</h2>
                <div className="h-96 rounded-xl overflow-hidden">
                  <AppMap
                    center={{
                      lat: property.location.coordinates.lat,
                      long: property.location.coordinates.long,
                    }}
                  />
                </div>
                <p className="mt-4 text-base font-semibold">
                  {property.location.locality}, {property.location.city}
                </p>
              </div>
            )}

          </div>

          {/* Right Column - Property Query Form */}
          <div className="lg:sticky lg:top-[86px] lg:h-[calc(100vh-86px)]">
            <div className="lg:sticky lg:top-24">
              <PropertyQueryForm
                propertyId={property.id}
                propertyTitle={property.propertyTitle}
                propertyDescription={`${property.location.locality}, ${property.location.city}\n\n${property.description}\n\nPrice: ₹${property.price.toLocaleString('en-IN')}${property.postingType === PostingType.RENT ? '/month' : ''}`}
                propertyUrl={
                  router.asPath
                    ? `${typeof window !== 'undefined' ? window.location.origin : ''}${router.asPath}`
                    : ''
                }
                inline={true}
                onSubmitSuccess={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGalleryModal
          images={property.images}
          initialIndex={selectedImage}
          title={property.propertyTitle}
          onClose={() => setShowGallery(false)}
        />
      )}

      <AppFooter />
    </div>
  );
};

export default ListingDetail;
