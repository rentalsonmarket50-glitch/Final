import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  PropertyType,
  FurnishingType,
  ConstructionStatus,
  PostedBy,
  BHKType,
  FloorType,
  FacingType,
  CommonAmenity,
  CommercialCategory,
  RoomType,
  PGOccupancyType,
  PlotType,
  IFilterState,
} from '../typings/FilterTypes';

interface PropertyFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: IFilterState;
  onFilterChange: (filters: IFilterState) => void;
  onApplyFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<IFilterState>(filters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: keyof IFilterState, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const toggleAmenity = (amenity: CommonAmenity) => {
    const amenities = localFilters.amenities || [];
    const updated = amenities.includes(amenity)
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity];
    updateFilter('amenities', updated);
  };

  const getPropertySpecificFilters = () => {
    switch (localFilters.propertyType) {
      case PropertyType.FLAT_APARTMENT:
        return (
          <>
            {/* BHK Filter */}
            <FilterSection
              title="BHK"
              isExpanded={expandedSections.has('bhk')}
              onToggle={() => toggleSection('bhk')}
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  BHKType.STUDIO,
                  BHKType.ONE_BHK,
                  BHKType.TWO_BHK,
                  BHKType.THREE_BHK,
                  BHKType.THREE_PLUS_ONE_BHK,
                  BHKType.FOUR_BHK,
                  BHKType.FOUR_PLUS_ONE_BHK,
                  BHKType.FIVE_BHK,
                ].map((bhk) => (
                  <FilterCheckbox
                    key={bhk}
                    label={bhk}
                    checked={localFilters.bhk === bhk}
                    onChange={() => updateFilter('bhk', localFilters.bhk === bhk ? '' : bhk)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Floor Filter */}
            <FilterSection
              title="Floor"
              isExpanded={expandedSections.has('floor')}
              onToggle={() => toggleSection('floor')}
            >
              <div className="space-y-2">
                {Object.values(FloorType).map((floor) => (
                  <FilterCheckbox
                    key={floor}
                    label={floor}
                    checked={localFilters.floor === floor}
                    onChange={() => updateFilter('floor', localFilters.floor === floor ? '' : floor)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Facing Filter */}
            <FilterSection
              title="Preferred Facing"
              isExpanded={expandedSections.has('facing')}
              onToggle={() => toggleSection('facing')}
            >
              <div className="grid grid-cols-2 gap-2">
                {Object.values(FacingType).map((facing) => (
                  <FilterCheckbox
                    key={facing}
                    label={facing}
                    checked={localFilters.facing === facing}
                    onChange={() => updateFilter('facing', localFilters.facing === facing ? '' : facing)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Parking Filter */}
            <FilterSection
              title="Parking"
              isExpanded={expandedSections.has('parking')}
              onToggle={() => toggleSection('parking')}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Car Parking</label>
                  <select
                    value={localFilters.parking?.cars || 0}
                    onChange={(e) =>
                      updateFilter('parking', {
                        ...localFilters.parking,
                        cars: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={0}>None</option>
                    <option value={1}>1 Car</option>
                    <option value={2}>2 Cars</option>
                  </select>
                </div>
                <FilterCheckbox
                  label="Bike Parking"
                  checked={localFilters.parking?.bikes || false}
                  onChange={() =>
                    updateFilter('parking', {
                      ...localFilters.parking,
                      bikes: !localFilters.parking?.bikes,
                    })
                  }
                />
              </div>
            </FilterSection>
          </>
        );

      case PropertyType.INDEPENDENT_HOUSE:
        return (
          <>
            <FilterSection
              title="BHK"
              isExpanded={expandedSections.has('bhk')}
              onToggle={() => toggleSection('bhk')}
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  BHKType.ONE_BHK,
                  BHKType.TWO_BHK,
                  BHKType.THREE_BHK,
                  BHKType.FOUR_BHK,
                  BHKType.FIVE_BHK,
                  BHKType.SIX_BHK,
                  BHKType.SEVEN_BHK,
                  BHKType.EIGHT_BHK,
                  BHKType.NINE_BHK,
                ].map((bhk) => (
                  <FilterCheckbox
                    key={bhk}
                    label={bhk}
                    checked={localFilters.bhk === bhk}
                    onChange={() => updateFilter('bhk', localFilters.bhk === bhk ? '' : bhk)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Plot Size"
              isExpanded={expandedSections.has('plotSize')}
              onToggle={() => toggleSection('plotSize')}
            >
              <div className="space-y-2">
                {['50-100 sq yard', '100-200 sq yard', '200-300 sq yard', '300+ sq yard'].map(
                  (size) => (
                    <FilterCheckbox
                      key={size}
                      label={size}
                      checked={false}
                      onChange={() => {}}
                    />
                  )
                )}
              </div>
            </FilterSection>

            <FilterSection
              title="Water Supply"
              isExpanded={expandedSections.has('waterSupply')}
              onToggle={() => toggleSection('waterSupply')}
            >
              <div className="space-y-2">
                {['Borewell', 'Municipal', 'Both'].map((supply) => (
                  <FilterCheckbox
                    key={supply}
                    label={supply}
                    checked={localFilters.waterSupply === supply}
                    onChange={() =>
                      updateFilter('waterSupply', localFilters.waterSupply === supply ? '' : supply)
                    }
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Floors"
              isExpanded={expandedSections.has('floors')}
              onToggle={() => toggleSection('floors')}
            >
              <div className="space-y-2">
                {['Single Floor', 'Duplex', 'Triplex'].map((floor) => (
                  <FilterCheckbox
                    key={floor}
                    label={floor}
                    checked={localFilters.floors === floor}
                    onChange={() => updateFilter('floors', localFilters.floors === floor ? '' : floor)}
                  />
                ))}
              </div>
            </FilterSection>
          </>
        );

      case PropertyType.BUILDER_FLOOR:
        return (
          <>
            <FilterSection
              title="BHK"
              isExpanded={expandedSections.has('bhk')}
              onToggle={() => toggleSection('bhk')}
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  BHKType.ONE_BHK,
                  BHKType.TWO_BHK,
                  BHKType.THREE_BHK,
                  BHKType.FOUR_BHK,
                ].map((bhk) => (
                  <FilterCheckbox
                    key={bhk}
                    label={bhk}
                    checked={localFilters.bhk === bhk}
                    onChange={() => updateFilter('bhk', localFilters.bhk === bhk ? '' : bhk)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Floor Number"
              isExpanded={expandedSections.has('floor')}
              onToggle={() => toggleSection('floor')}
            >
              <div className="space-y-2">
                {['1st', '2nd', '3rd', '4th'].map((floor) => (
                  <FilterCheckbox
                    key={floor}
                    label={floor}
                    checked={false}
                    onChange={() => {}}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterCheckbox
              label="Lift"
              checked={localFilters.lift || false}
              onChange={() => updateFilter('lift', !localFilters.lift)}
            />

            <FilterCheckbox
              label="Modular Kitchen"
              checked={localFilters.modularKitchen || false}
              onChange={() => updateFilter('modularKitchen', !localFilters.modularKitchen)}
            />
          </>
        );

      case PropertyType.PLOT_LAND:
        return (
          <>
            <FilterSection
              title="Plot Type"
              isExpanded={expandedSections.has('plotType')}
              onToggle={() => toggleSection('plotType')}
            >
              <div className="space-y-2">
                {Object.values(PlotType).map((type) => (
                  <FilterCheckbox key={type} label={type} checked={false} onChange={() => {}} />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Plot Size"
              isExpanded={expandedSections.has('plotSize')}
              onToggle={() => toggleSection('plotSize')}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Unit</label>
                  <select
                    value={localFilters.plotSize?.unit || 'sqft'}
                    onChange={(e) =>
                      updateFilter('plotSize', {
                        ...localFilters.plotSize,
                        unit: e.target.value as 'sqft' | 'sqyard' | 'acre',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sqft">Sq Ft</option>
                    <option value="sqyard">Sq Yard</option>
                    <option value="acre">Acre</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min</label>
                    <input
                      type="number"
                      value={localFilters.plotSize?.min || ''}
                      onChange={(e) =>
                        updateFilter('plotSize', {
                          ...localFilters.plotSize,
                          min: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max</label>
                    <input
                      type="number"
                      value={localFilters.plotSize?.max || ''}
                      onChange={(e) =>
                        updateFilter('plotSize', {
                          ...localFilters.plotSize,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            <FilterSection
              title="Plot Facing"
              isExpanded={expandedSections.has('facing')}
              onToggle={() => toggleSection('facing')}
            >
              <div className="grid grid-cols-2 gap-2">
                {Object.values(FacingType).map((facing) => (
                  <FilterCheckbox
                    key={facing}
                    label={facing}
                    checked={localFilters.facing === facing}
                    onChange={() => updateFilter('facing', localFilters.facing === facing ? '' : facing)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Road Width"
              isExpanded={expandedSections.has('roadWidth')}
              onToggle={() => toggleSection('roadWidth')}
            >
              <div className="space-y-2">
                {['10 ft', '20 ft', '30 ft', '40 ft+'].map((width) => (
                  <FilterCheckbox
                    key={width}
                    label={width}
                    checked={localFilters.roadWidth === width}
                    onChange={() => updateFilter('roadWidth', localFilters.roadWidth === width ? '' : width)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterCheckbox
              label="Boundary Wall"
              checked={localFilters.boundaryWall || false}
              onChange={() => updateFilter('boundaryWall', !localFilters.boundaryWall)}
            />
          </>
        );

      case PropertyType.COMMERCIAL:
        return (
          <>
            <FilterSection
              title="Commercial Category"
              isExpanded={expandedSections.has('commercialCategory')}
              onToggle={() => toggleSection('commercialCategory')}
            >
              <div className="space-y-2">
                {Object.values(CommercialCategory).map((category) => (
                  <FilterCheckbox
                    key={category}
                    label={category}
                    checked={localFilters.commercialCategory === category}
                    onChange={() =>
                      updateFilter(
                        'commercialCategory',
                        localFilters.commercialCategory === category ? '' : category
                      )
                    }
                  />
                ))}
              </div>
            </FilterSection>

            {localFilters.commercialCategory === CommercialCategory.OFFICE_SPACE && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Carpet Area (sq ft)</label>
                  <input
                    type="number"
                    value={localFilters.carpetArea || ''}
                    onChange={(e) => updateFilter('carpetArea', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter area"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Cabins Count</label>
                  <input
                    type="number"
                    value={localFilters.cabinsCount || ''}
                    onChange={(e) => updateFilter('cabinsCount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter count"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Workstations</label>
                  <input
                    type="number"
                    value={localFilters.workstations || ''}
                    onChange={(e) => updateFilter('workstations', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter count"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Washrooms</label>
                  <input
                    type="number"
                    value={localFilters.washrooms || ''}
                    onChange={(e) => updateFilter('washrooms', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter count"
                  />
                </div>
                <FilterCheckbox
                  label="Pantry"
                  checked={localFilters.pantry || false}
                  onChange={() => updateFilter('pantry', !localFilters.pantry)}
                />
              </>
            )}

            {localFilters.commercialCategory === CommercialCategory.WAREHOUSE_GODOWN && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Carpet Area (sq ft)</label>
                  <input
                    type="number"
                    value={localFilters.carpetArea || ''}
                    onChange={(e) => updateFilter('carpetArea', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter area"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Ceiling Height (ft)</label>
                  <input
                    type="number"
                    value={localFilters.ceilingHeight || ''}
                    onChange={(e) => updateFilter('ceilingHeight', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter height"
                  />
                </div>
                <FilterCheckbox
                  label="Loading Dock"
                  checked={localFilters.loadingDock || false}
                  onChange={() => updateFilter('loadingDock', !localFilters.loadingDock)}
                />
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Power Load</label>
                  <input
                    type="text"
                    value={localFilters.powerLoad || ''}
                    onChange={(e) => updateFilter('powerLoad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter power load"
                  />
                </div>
                <FilterCheckbox
                  label="Parking for Trucks"
                  checked={localFilters.truckParking || false}
                  onChange={() => updateFilter('truckParking', !localFilters.truckParking)}
                />
              </>
            )}

            {localFilters.commercialCategory === CommercialCategory.SHOP_SHOWROOM && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Frontage (Feet)</label>
                  <input
                    type="number"
                    value={localFilters.frontage || ''}
                    onChange={(e) => updateFilter('frontage', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter frontage"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Carpet Area (sq ft)</label>
                  <input
                    type="number"
                    value={localFilters.carpetArea || ''}
                    onChange={(e) => updateFilter('carpetArea', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter area"
                  />
                </div>
                <FilterCheckbox
                  label="Washroom"
                  checked={localFilters.washrooms ? localFilters.washrooms > 0 : false}
                  onChange={() => updateFilter('washrooms', localFilters.washrooms ? 0 : 1)}
                />
                <FilterCheckbox
                  label="Power Backup"
                  checked={localFilters.amenities?.includes(CommonAmenity.POWER_BACKUP) || false}
                  onChange={() => toggleAmenity(CommonAmenity.POWER_BACKUP)}
                />
              </>
            )}
          </>
        );

      case PropertyType.ROOM:
        return (
          <>
            <FilterSection
              title="Room Type"
              isExpanded={expandedSections.has('roomType')}
              onToggle={() => toggleSection('roomType')}
            >
              <div className="space-y-2">
                {Object.values(RoomType).map((type) => (
                  <FilterCheckbox
                    key={type}
                    label={type}
                    checked={localFilters.roomType === type}
                    onChange={() => updateFilter('roomType', localFilters.roomType === type ? '' : type)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterCheckbox
              label="Attached Bathroom"
              checked={localFilters.attachedBathroom || false}
              onChange={() => updateFilter('attachedBathroom', !localFilters.attachedBathroom)}
            />
            <FilterCheckbox
              label="Kitchen Access"
              checked={localFilters.kitchenAccess || false}
              onChange={() => updateFilter('kitchenAccess', !localFilters.kitchenAccess)}
            />
            <FilterCheckbox
              label="Wifi"
              checked={localFilters.wifi || false}
              onChange={() => updateFilter('wifi', !localFilters.wifi)}
            />
            <FilterCheckbox
              label="Electricity Included"
              checked={localFilters.electricityIncluded || false}
              onChange={() => updateFilter('electricityIncluded', !localFilters.electricityIncluded)}
            />
            <FilterCheckbox
              label="Air Cooler / AC"
              checked={localFilters.airCoolerAC || false}
              onChange={() => updateFilter('airCoolerAC', !localFilters.airCoolerAC)}
            />
          </>
        );

      case PropertyType.PG:
        return (
          <>
            <FilterSection
              title="Occupancy Type"
              isExpanded={expandedSections.has('pgOccupancy')}
              onToggle={() => toggleSection('pgOccupancy')}
            >
              <div className="space-y-2">
                {Object.values(PGOccupancyType).map((type) => (
                  <FilterCheckbox
                    key={type}
                    label={type}
                    checked={localFilters.pgOccupancy === type}
                    onChange={() =>
                      updateFilter('pgOccupancy', localFilters.pgOccupancy === type ? '' : type)
                    }
                  />
                ))}
              </div>
            </FilterSection>

            <FilterCheckbox
              label="Food Included"
              checked={localFilters.foodIncluded || false}
              onChange={() => updateFilter('foodIncluded', !localFilters.foodIncluded)}
            />
            <FilterCheckbox
              label="Wifi"
              checked={localFilters.wifi || false}
              onChange={() => updateFilter('wifi', !localFilters.wifi)}
            />
            <FilterCheckbox
              label="Housekeeping"
              checked={localFilters.housekeeping || false}
              onChange={() => updateFilter('housekeeping', !localFilters.housekeeping)}
            />
            <FilterCheckbox
              label="Laundry"
              checked={localFilters.laundry || false}
              onChange={() => updateFilter('laundry', !localFilters.laundry)}
            />
            <FilterCheckbox
              label="Security"
              checked={localFilters.amenities?.includes(CommonAmenity.SECURITY) || false}
              onChange={() => toggleAmenity(CommonAmenity.SECURITY)}
            />
            <FilterCheckbox
              label="Electricity Included"
              checked={localFilters.electricityIncluded || false}
              onChange={() => updateFilter('electricityIncluded', !localFilters.electricityIncluded)}
            />
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Filter Panel */}
      <div className="relative bg-white w-full max-w-2xl ml-auto h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* 1. Property Type */}
          <FilterSection
            title="Property Type"
            isExpanded={expandedSections.has('propertyType')}
            onToggle={() => toggleSection('propertyType')}
          >
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PropertyType).map((type) => (
                <FilterCheckbox
                  key={type}
                  label={type}
                  checked={localFilters.propertyType === type}
                  onChange={() =>
                    updateFilter('propertyType', localFilters.propertyType === type ? '' : type)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* 2. Location Filter */}
          <FilterSection
            title="Location"
            isExpanded={expandedSections.has('location')}
            onToggle={() => toggleSection('location')}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={localFilters.location.city || ''}
                  onChange={(e) =>
                    updateFilter('location', {
                      ...localFilters.location,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                <input
                  type="text"
                  value={localFilters.location.locality || ''}
                  onChange={(e) =>
                    updateFilter('location', {
                      ...localFilters.location,
                      locality: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter locality"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nearby Landmarks
                </label>
                <input
                  type="text"
                  value={localFilters.location.nearbyLandmarks || ''}
                  onChange={(e) =>
                    updateFilter('location', {
                      ...localFilters.location,
                      nearbyLandmarks: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter landmarks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={localFilters.location.pincode || ''}
                  onChange={(e) =>
                    updateFilter('location', {
                      ...localFilters.location,
                      pincode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </FilterSection>

          {/* 3. Price Range Filter */}
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.has('priceRange')}
            onToggle={() => toggleSection('priceRange')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={localFilters.priceRange.min || ''}
                    onChange={(e) =>
                      updateFilter('priceRange', {
                        ...localFilters.priceRange,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={localFilters.priceRange.max || ''}
                    onChange={(e) =>
                      updateFilter('priceRange', {
                        ...localFilters.priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Max"
                  />
                </div>
              </div>
              {/* Price Range Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={localFilters.priceRange.max || 10000000}
                  onChange={(e) =>
                    updateFilter('priceRange', {
                      ...localFilters.priceRange,
                      max: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹{localFilters.priceRange.max?.toLocaleString('en-IN') || '10,00,00,000'}</span>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* 4. Furnishing Filter */}
          <FilterSection
            title="Furnishing"
            isExpanded={expandedSections.has('furnishing')}
            onToggle={() => toggleSection('furnishing')}
          >
            <div className="space-y-2">
              {Object.values(FurnishingType).map((furnishing) => (
                <FilterCheckbox
                  key={furnishing}
                  label={furnishing}
                  checked={localFilters.furnishing === furnishing}
                  onChange={() =>
                    updateFilter('furnishing', localFilters.furnishing === furnishing ? '' : furnishing)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* 5. Construction Status */}
          <FilterSection
            title="Construction Status"
            isExpanded={expandedSections.has('constructionStatus')}
            onToggle={() => toggleSection('constructionStatus')}
          >
            <div className="space-y-2">
              {Object.values(ConstructionStatus).map((status) => (
                <FilterCheckbox
                  key={status}
                  label={status}
                  checked={localFilters.constructionStatus === status}
                  onChange={() =>
                    updateFilter(
                      'constructionStatus',
                      localFilters.constructionStatus === status ? '' : status
                    )
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* 6. Posted By */}
          <FilterSection
            title="Posted By"
            isExpanded={expandedSections.has('postedBy')}
            onToggle={() => toggleSection('postedBy')}
          >
            <div className="space-y-2">
              {Object.values(PostedBy).map((postedBy) => (
                <FilterCheckbox
                  key={postedBy}
                  label={postedBy}
                  checked={localFilters.postedBy === postedBy}
                  onChange={() =>
                    updateFilter('postedBy', localFilters.postedBy === postedBy ? '' : postedBy)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* 7. Common Amenities */}
          <FilterSection
            title="Amenities"
            isExpanded={expandedSections.has('amenities')}
            onToggle={() => toggleSection('amenities')}
          >
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CommonAmenity).map((amenity) => (
                <FilterCheckbox
                  key={amenity}
                  label={amenity}
                  checked={localFilters.amenities?.includes(amenity) || false}
                  onChange={() => toggleAmenity(amenity)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Property Type Specific Filters */}
          {localFilters.propertyType && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {localFilters.propertyType} Specific Filters
              </h3>
              {getPropertySpecificFilters()}
            </div>
          )}

          {/* Advanced Filters */}
          <FilterSection
            title="Advanced Filters"
            isExpanded={expandedSections.has('advanced')}
            onToggle={() => toggleSection('advanced')}
          >
            <div className="space-y-2">
              <FilterCheckbox
                label="Newly Listed"
                checked={localFilters.newlyListed || false}
                onChange={() => updateFilter('newlyListed', !localFilters.newlyListed)}
              />
              <FilterCheckbox
                label="Verified Listings"
                checked={localFilters.verifiedListings || false}
                onChange={() => updateFilter('verifiedListings', !localFilters.verifiedListings)}
              />
              <FilterCheckbox
                label="Negotiable Price"
                checked={localFilters.negotiablePrice || false}
                onChange={() => updateFilter('negotiablePrice', !localFilters.negotiablePrice)}
              />
              <FilterCheckbox
                label="RERA Approved"
                checked={localFilters.reraApproved || false}
                onChange={() => updateFilter('reraApproved', !localFilters.reraApproved)}
              />
              <FilterCheckbox
                label="Pet Friendly"
                checked={localFilters.petFriendly || false}
                onChange={() => updateFilter('petFriendly', !localFilters.petFriendly)}
              />
              <FilterCheckbox
                label="Immediate Move-in"
                checked={localFilters.immediateMoveIn || false}
                onChange={() => updateFilter('immediateMoveIn', !localFilters.immediateMoveIn)}
              />
            </div>
          </FilterSection>
        </div>

        {/* Footer with Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
          <button
            onClick={() => {
              setLocalFilters({
                propertyType: '',
                location: { city: '', locality: '', nearbyLandmarks: '', pincode: '' },
                priceRange: { min: 0, max: 0 },
                furnishing: '',
                constructionStatus: '',
                postedBy: '',
                amenities: [],
              });
            }}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
};

const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default PropertyFilters;

