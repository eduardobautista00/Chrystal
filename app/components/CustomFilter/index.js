import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const currencyLabels = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  // Add more currencies as needed
};

const unitLabels = {
  'ft²': 'ft²',
  'km²': 'km²',
  'acres': 'acres',
  // Add more units as needed
};

// Add this helper function near the top of the component
const getDisplayCurrency = (selectedCurrencies) => {
  if (!selectedCurrencies || selectedCurrencies.length === 0) {
    return Object.values(currencyLabels).join('/');
  }
  return currencyLabels[selectedCurrencies[0]];
};

// Add this helper function near the top of the component, next to getDisplayCurrency
const getDisplayUnit = (selectedUnits) => {
  if (!selectedUnits || selectedUnits.length === 0) {
    return Object.values(unitLabels).join('/');
  }
  return unitLabels[selectedUnits[0]];
};

export default function FilterScreen(props) {
  const [filters, setFilters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState(null);
  const [newFilterName, setNewFilterName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'];
  const [selectedFilterOption, setSelectedFilterOption] = useState([]);
  const [priceRangeValues, setPriceRangeValues] = useState([0, 100]);
  const [maxPriceRange, setMaxPriceRange] = useState(100);
  const [minPriceRange, setMinPriceRange] = useState(0);
  const [areaRangeValues, setAreaRangeValues] = useState([0, 1000]);
  const [maxAreaRange, setMaxAreaRange] = useState(1000);
  const [minAreaRange, setMinAreaRange] = useState(0);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRangeValues[0]);
  const [debouncedMaxPriceRange, setDebouncedMaxPriceRange] = useState(priceRangeValues[1]);
  const [debouncedAreaRange, setDebouncedAreaRange] = useState(areaRangeValues[0]);
  const [debouncedMaxAreaRange, setDebouncedMaxAreaRange] = useState(areaRangeValues[1]);
  
  const [selectedCurrency, setSelectedCurrency] = useState(['USD']);
  const [selectedUnit, setSelectedUnit] = useState(['ft²']);
  const [selectedFilterId, setSelectedFilterId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Add these constants for the options
  const propertyTypes = ['House', 'Townhouse', 'Unit', 'Land'];
  const currencyOptions = [
    { label: '$', value: 'USD' },
    { label: '€', value: 'EUR' },
    { label: '¥', value: 'JPY' },
  ];
  const unitOptions = [
    { label: 'ft²', value: 'ft²' },
    { label: 'km²', value: 'km²' },
    { label: 'acres', value: 'acres' },
  ];

  // Debounce effect for price range
  useEffect(() => {
    const handler = setTimeout(() => {
      setPriceRangeValues([debouncedPriceRange, debouncedMaxPriceRange]);
    }, 300); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedPriceRange, debouncedMaxPriceRange]);

  // Debounce effect for area range
  useEffect(() => {
    const handler = setTimeout(() => {
      setAreaRangeValues([debouncedAreaRange, debouncedMaxAreaRange]);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedAreaRange, debouncedMaxAreaRange]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const storedFilters = await AsyncStorage.getItem('filters');
        if (storedFilters) {
          setFilters(JSON.parse(storedFilters));
        }
      } catch (error) {
        console.error('Failed to load filters from storage:', error);
      }
    };

    loadFilters(); // Load filters when the component mounts
  }, []);

  useEffect(() => {
    //console.log('Initial priceRangeValues:', priceRangeValues);
  }, []);

  // Log the selected filter data
  useEffect(() => {
    if (selectedFilterId !== null) {
      const customFilter = filters.find(filter => filter.id === selectedFilterId);
      setSelectedFilter(customFilter);
      console.log('Selected custom filter data:', customFilter);
    }
  }, [selectedFilterId]);

  // Add these handler functions
  const handlePropertyTypeSelect = (type) => {
    setSelectedFilterOption(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(prev => {
      if (prev.includes(currency)) {
        const newSelection = prev.filter(c => c !== currency);
        return newSelection.length === 0 ? [] : newSelection;
      }
      return [currency]; // Only allow one selection
    });
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(prev => {
      if (prev.includes(unit)) {
        const newSelection = prev.filter(u => u !== unit);
        return newSelection.length === 0 ? [] : newSelection;
      }
      return [unit]; // Only allow one selection
    });
  };

  const openModal = (filter = null) => {
    if (filter) {
      console.log('Editing filter:', filter);
      setIsEditMode(true);
      setCurrentFilterId(filter.id);
      setNewFilterName(filter.name);
      setSelectedColor(filter.pinColor || null);
      setPriceRangeValues(filter.priceRange || [0, 100]);
      setMinPriceRange(filter.priceRange ? filter.priceRange[0] : 0);
      setMaxPriceRange(filter.priceRange ? filter.priceRange[1] : 100);
      setMinAreaRange(filter.areaRange ? filter.areaRange[0] : 0);
      setMaxAreaRange(filter.areaRange ? filter.areaRange[1] : 1000);
      setAreaRangeValues(filter.areaRange || [0, 1000]);
      setSelectedCurrency(filter.currency ? [filter.currency] : []);
      setSelectedUnit(filter.unit ? [filter.unit] : []);
      // Clean up and validate property_type array
      const validPropertyTypes = ['House', 'Townhouse', 'Unit', 'Land'];
      const cleanedPropertyTypes = filter.property_type ? 
        (Array.isArray(filter.property_type) ? 
          filter.property_type.filter(type => validPropertyTypes.includes(type)) : 
          [filter.property_type]
        ).filter(type => validPropertyTypes.includes(type)) : 
        [];
      setSelectedFilterOption(cleanedPropertyTypes);
      props.onFilterSelect(filter);
    } else {
      setIsEditMode(false);
      setNewFilterName('');
      setSelectedColor(null);
      setPriceRangeValues([0, 100]);
      setMinPriceRange(0);
      setMaxPriceRange(100);
      setAreaRangeValues([0, 1000]);
      setMinAreaRange(0);
      setMaxAreaRange(1000);
      setSelectedFilterOption([]);
      setSelectedCurrency(['USD']);
      setSelectedUnit(['ft²']);
    }
    setIsModalVisible(true);
  };

  const saveFilter = async () => {
    const filterData = {
      id: isEditMode ? currentFilterId : Date.now(),
      name: newFilterName,
      pinColor: selectedColor,
      property_type: selectedFilterOption.length > 0 ? selectedFilterOption : null,
      priceRange: priceRangeValues[0] === 0 && priceRangeValues[1] === 100 ? null : priceRangeValues,
      areaRange: areaRangeValues[0] === 0 && areaRangeValues[1] === 1000 ? null : areaRangeValues,
      currency: selectedCurrency.length > 0 ? selectedCurrency : null,
      unit: selectedUnit.length > 0 ? selectedUnit : null,
    };

    if (isEditMode) {
      // Update the existing filter
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) =>
          filter.id === currentFilterId
            ? filterData
            : filter
        );
        const sortedFilters = updatedFilters.sort((a, b) => a.name.length - b.name.length);
        AsyncStorage.setItem('filters', JSON.stringify(sortedFilters));
        return sortedFilters;
      });
    } else {
      // Create a new filter
      setFilters((prevFilters) => {
        const updatedFilters = [...prevFilters, filterData];
        const sortedFilters = updatedFilters.sort((a, b) => a.name.length - b.name.length);
        AsyncStorage.setItem('filters', JSON.stringify(sortedFilters));
        return sortedFilters;
      });
    }
  
    // Reset modal inputs
    setNewFilterName('');
    setSelectedColor(null);
    setIsModalVisible(false);
    setSelectedFilterId(null);
  };
  
  const deleteFilter = async (id) => {
    const updatedFilters = filters.filter(filter => filter.id !== id);
    setFilters(updatedFilters);
    await AsyncStorage.setItem('filters', JSON.stringify(updatedFilters)); // Delete from local storage
  };

  const handleMaxPriceChange = (text) => {
    const value = Number(text);
    console.log('Input value:', value); // Log the input value
    if (value <= 1000000000) {
        setMaxPriceRange(value);
        const newPriceRangeValues = [priceRangeValues[0], value > priceRangeValues[0] ? value : priceRangeValues[0]];
        console.log('Updated priceRangeValues:', newPriceRangeValues); // Log the updated values
        setPriceRangeValues(newPriceRangeValues);
    }
  };

  const handleMaxAreaChange = (text) => {
    const value = Number(text);
    if (value <= 510100000000) { // Set a maximum limi t for area range to the maximum area of the planet
      setMaxAreaRange(value);
      const newAreaRangeValues = [areaRangeValues[0], value > areaRangeValues[0] ? value : areaRangeValues[0]];
      console.log('Updated areaRangeValues:', newAreaRangeValues); // Log the updated values
      setAreaRangeValues(newAreaRangeValues);
    }
  };

  const handleMinPriceChange = (text) => {
    const value = Number(text);
    if (value >= 0) { // Ensure the range minimum does not go below 0
      setMinPriceRange(value);
      const newPriceRangeValues = [value, priceRangeValues[1] < value ? value : priceRangeValues[1]];
      console.log('Updated priceRangeValues:', newPriceRangeValues); // Log the updated values
      setPriceRangeValues(newPriceRangeValues);
    }
  };

  const handleMinAreaChange = (text) => {
    const value = Number(text);
    if (value >= 0) { // Ensure the range minimum does not go below 0
      setMinAreaRange(value);
      const newAreaRangeValues = [value, areaRangeValues[1] < value ? value : areaRangeValues[1]];
      console.log('Updated areaRangeValues:', newAreaRangeValues); // Log the updated values
      setAreaRangeValues(newAreaRangeValues);
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilterId(filter.id);
    setSelectedFilter(filter);
    props.onFilterSelect({
      ...filter,
      pinColor: filter.pinColor,
      property_type: filter.property_type || null,
      priceRange: filter.priceRange || null,
      areaRange: filter.areaRange || null,
      currency: filter.currency || null,
      unit: filter.unit || null
    });
    props.refRBSheet.current.close();
  };

  const handleColorSelect = (color) => {
    setSelectedColor(selectedColor === color ? null : color);
  };

  return (
    <View style={styles.container}>
      {/* Make this section scrollable */}
      <ScrollView contentContainerStyle={styles.filterContainer} horizontal={false} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.allFilter} onPress={() => {
          setSelectedFilterId(null); // Reset the selected filter ID
          props.onFilterChange({}); // Pass an empty object to reset the filter
          props.refRBSheet.current.close();
        }}>
          <Text style={styles.allText}>All</Text>
        </TouchableOpacity>
        {filters.map((filter) => (
          <TouchableOpacity 
            key={filter.id} 
            style={[
              styles.filterButton, 
              { 
                backgroundColor: filter.pinColor || 'transparent',
                borderColor: '#000',
                borderWidth: selectedFilterId === filter.id ? 2 : (filter.pinColor ? 0 : 1)
              }
            ]} 
            onPress={() => handleFilterSelect(filter)}
          >
            <Text style={styles.filterText}>{filter.name}</Text>
            <TouchableOpacity onPress={() => openModal(filter)} style={styles.editButton}>
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFilter(filter.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => openModal()} style={styles.addFilter}>
          <Text style={styles.addFilterText}>Add filter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for adding/editing a filter */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}> 
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                setIsModalVisible(false);
                // Reset modal inputs
                setNewFilterName('');
                setMinPriceRange(0);
                setMinAreaRange(0);
                setPriceRangeValues([0, 100]);
                setAreaRangeValues([0, 1000]);
                setMaxPriceRange(100);
                setMaxAreaRange(1000);
                setSelectedColor(null);
                setSelectedFilterOption([]);
              }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitleHeader }>{isEditMode ? 'Edit Filter' : 'Add Filter'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter filter name"
              maxLength={15}
              value={newFilterName}
              onChangeText={setNewFilterName}
            />
            {/* Character counter moved inside the modal */}
            <View style={styles.characterCounterContainer}>
              <Text style={styles.characterCounterText}>
                {newFilterName.length} / 15
              </Text>
            </View>

            <Text style={styles.modalTitle}>Filter by:</Text>
            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Color</Text>
              <View style={[styles.colorPickerContainer]}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => handleColorSelect(color)}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      selectedColor === color && { borderWidth: 3, borderColor: '#000' }
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Type</Text>
              <View style={styles.typeGridContainer}>
                <View style={styles.typeRow}>
                  {propertyTypes.slice(0, 2).map((type) => (
                    <View key={type} style={styles.typeItem}>
                      <TouchableOpacity
                        onPress={() => handlePropertyTypeSelect(type)}
                        style={[
                          styles.checkbox,
                          selectedFilterOption.includes(type) && styles.checkedCheckbox
                        ]}
                      />
                      <Text style={styles.checkboxText}>{type}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.typeRow}>
                  {propertyTypes.slice(2, 4).map((type) => (
                    <View key={type} style={styles.typeItem}>
                      <TouchableOpacity
                        onPress={() => handlePropertyTypeSelect(type)}
                        style={[
                          styles.checkbox,
                          selectedFilterOption.includes(type) && styles.checkedCheckbox
                        ]}
                      />
                      <Text style={styles.checkboxText}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Currency and Area Unit Section */}
            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Currency</Text>
              <View style={styles.typeGridContainer}>
                <View style={styles.typeRow}>
                  {currencyOptions.map(({ label, value }) => (
                    <View key={value} style={styles.typeItem}>
                      <TouchableOpacity
                        onPress={() => handleCurrencySelect(value)}
                        style={[
                          styles.checkbox,
                          selectedCurrency.includes(value) && styles.checkedCheckbox
                        ]}
                      />
                      <Text style={styles.checkboxText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Area Unit</Text>
              <View style={styles.typeGridContainer}>
                <View style={styles.typeRow}>
                  {unitOptions.map(({ label, value }) => (
                    <View key={value} style={styles.typeItem}>
                      <TouchableOpacity
                        onPress={() => handleUnitSelect(value)}
                        style={[
                          styles.checkbox,
                          selectedUnit.includes(value) && styles.checkedCheckbox
                        ]}
                      />
                      <Text style={styles.checkboxText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Price Range</Text>
              <MultiSlider
                values={priceRangeValues}
                onValuesChange={(values) => {
                    console.log('Slider values changed:', values); // Log the slider values
                    setPriceRangeValues(values);
                }}
                min={0}
                max={maxPriceRange}
                step={1}
                sliderLength={width - 40}
                selectedStyle={{ backgroundColor: '#7B61FF' }}
                trackStyle={{ backgroundColor: '#ccc' }}
                markerStyle={{ backgroundColor: '#7B61FF' }}
                style={[styles.slider]}
              />
              <View style={styles.rowContainer}>
                <TextInput
                  style={[styles.input, {width: 50}]}
                  placeholder="Min Price"
                  keyboardType="numeric"
                  value={String(minPriceRange)}
                  onChangeText={handleMinPriceChange}
                  textAlign="center"
                  multiline={false}
                  numberOfLines={1}
                />
                <View style={styles.rangeTextContainer}>
                  <Text style={styles.rangeTitleText}>Price Range:</Text>
                  <Text style={styles.rangeText}>
                    {`${getDisplayCurrency(selectedCurrency)} ${priceRangeValues[0]} - ${getDisplayCurrency(selectedCurrency)} ${priceRangeValues[1]}`}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, {width: 50}]}
                  placeholder="Max Price"
                  keyboardType="numeric"
                  value={String(maxPriceRange)}
                  onChangeText={handleMaxPriceChange}
                  textAlign="center"
                  multiline={false}
                  numberOfLines={1}
                />
              </View>
            </View>
            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Location Range</Text>
              <MultiSlider
                values={areaRangeValues}
                onValuesChange={(values) => setAreaRangeValues(values)}
                min={0}
                max={maxAreaRange}
                step={1}
                sliderLength={width-40}
                selectedStyle={{ backgroundColor: '#7B61FF' }}
                trackStyle={{ backgroundColor: '#ccc' }}
                markerStyle={{ backgroundColor: '#7B61FF' }}
              />
              <View style={styles.rowContainer}>
                <TextInput
                  style={[styles.input, { width: 50 }]}
                  placeholder="Min Area"
                  keyboardType="numeric"
                  value={String(minAreaRange)}
                  onChangeText={handleMinAreaChange}
                  textAlign="center"
                  multiline={false}
                  numberOfLines={1}
                />
                <View style={styles.rangeTextContainer}>
                  <Text style={styles.rangeTitleText}>Area Range:</Text>
                  <Text style={styles.rangeText}>{`${areaRangeValues[0]} - ${areaRangeValues[1]} ${getDisplayUnit(selectedUnit)}`}</Text>
                </View>
                <TextInput
                  style={[styles.input, { width: 50, overflow: 'hidden' }]}
                  placeholder="Max Area"
                  keyboardType="numeric"
                  value={String(maxAreaRange)}
                  onChangeText={handleMaxAreaChange}
                  textAlign="center"
                  multiline={false}
                  numberOfLines={1}
                />
              </View>
            </View>
            
            
          </ScrollView> 
          <TouchableOpacity 
              onPress={saveFilter} 
              style={[styles.saveButton, { opacity: newFilterName.length === 0 ? 0.5 : 1 }]} 
              disabled={newFilterName.length === 0}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
