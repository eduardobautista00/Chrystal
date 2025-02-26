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

export default function FilterScreen(props) {
  const [filters, setFilters] = useState([{ id: 1, name: 'Hot', color: '#ff4d4d' }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState(null);
  const [newFilterName, setNewFilterName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff4d4d');
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'];
  const [selectedFilterOption, setSelectedFilterOption] = useState('');
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
  
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedUnit, setSelectedUnit] = useState('ft²');
  const [selectedFilterId, setSelectedFilterId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

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

  const openModal = (filter = null) => {
    if (filter) {
      setIsEditMode(true);
      setCurrentFilterId(filter.id);
      setNewFilterName(filter.name);
      setSelectedColor(filter.color);
      setPriceRangeValues(filter.priceRange || [0, 100]);
      setMinPriceRange(filter.priceRange ? filter.priceRange[0] : 0);
      setMaxPriceRange(filter.priceRange ? filter.priceRange[1] : 100);
      setMinAreaRange(filter.areaRange ? filter.areaRange[0] : 0);
      setMaxAreaRange(filter.areaRange ? filter.areaRange[1] : 1000);
      setAreaRangeValues(filter.areaRange || [0, 1000]);
      setSelectedCurrency(filter.currency || 'USD');
      setSelectedUnit(filter.unit || 'ft²');
      setSelectedFilterOption(filter.property_type || '');
      props.onFilterSelect(filter);
    } else {
      setIsEditMode(false);
      setNewFilterName('');
      setSelectedColor('#ff4d4d');
      setPriceRangeValues([0, 100]);
      setMinPriceRange(0);
      setMaxPriceRange(100);
      setAreaRangeValues([0, 1000]);
      setMinAreaRange(0);
      setMaxAreaRange(1000);
      setSelectedCurrency('USD');
      setSelectedUnit('ft²');
      setSelectedFilterOption('');
    }
    setIsModalVisible(true);
  };

  const saveFilter = async () => {
    if (isEditMode) {
      // Update the existing filter
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) =>
          filter.id === currentFilterId
            ? { ...filter, name: newFilterName, pin_color: selectedColor, priceRange: priceRangeValues, areaRange: areaRangeValues, currency: selectedCurrency, unit: selectedUnit, property_type: selectedFilterOption }
            : filter
        );
        // Sort filters by length of the filter name
        const sortedFilters = updatedFilters.sort((a, b) => a.name.length - b.name.length);
        AsyncStorage.setItem('filters', JSON.stringify(sortedFilters)); // Save to local storage
        return sortedFilters;
      });
    } else {
      // Create a new filter
      const newFilter = {
        id: Date.now(),
        name: newFilterName,
        pin_color: selectedColor,
        priceRange: priceRangeValues,
        areaRange: areaRangeValues,
        property_type: selectedFilterOption,
        currency: selectedCurrency,
        unit: selectedUnit,
      };
      setFilters((prevFilters) => {
        const updatedFilters = [...prevFilters, newFilter];
        // Sort filters by length of the filter name
        const sortedFilters = updatedFilters.sort((a, b) => a.name.length - b.name.length);
        AsyncStorage.setItem('filters', JSON.stringify(sortedFilters)); // Save to local storage
        return sortedFilters;
      });
    }
  
    // Reset modal inputs
    setNewFilterName('');
    setSelectedColor('#ff4d4d');
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
    // Ensure we're passing the complete filter object with the correct color
    props.onFilterSelect({
      ...filter,
      pin_color: filter.pin_color, // Explicitly include the color
      property_type: filter.property_type || [],
      priceRange: filter.priceRange || [0, 100],
      areaRange: filter.areaRange || [0, 1000],
      currency: filter.currency || 'USD',
      unit: filter.unit || 'ft²'
    });
    props.refRBSheet.current.close();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter</Text>

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
                backgroundColor: filter.color, 
                borderColor: selectedFilterId === filter.id ? '#000' : 'transparent', 
                borderWidth: selectedFilterId === filter.id ? 2 : 0 
              }
            ]} 
            onPress={() => handleFilterSelect(filter)}  // Use the new handler
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
                setSelectedColor('#ff4d4d');
                setSelectedFilterOption('');
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
                    onPress={() => setSelectedColor(color)}
                    style={[styles.colorCircle, { backgroundColor: color },
                      selectedColor === color && { borderWidth: 3, borderColor: '#000' } // Add a border to the selected color
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filterOptionSection}>
              <Text style={styles.filterOptionTitle}>Type</Text>
              <View style={styles.rowLayout}>
                {['House', 'Townhouse', 'Unit', 'Land'].map((type) => (
                  <View key={type} style={styles.checkboxContainer}>
                    <TouchableOpacity
                      onPress={() => setSelectedFilterOption(type === selectedFilterOption ? '' : type)}
                      style={[styles.checkbox, selectedFilterOption === type && styles.checkedCheckbox]}
                    />
                    <Text style={styles.checkboxText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Currency and Area Unit Selector in Modal */}
            <View style={[styles.filterOptionSection, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.filterOptionTitle}>Currency</Text>
                <Picker
                  selectedValue={selectedCurrency}
                  onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="$" value="USD" />
                  <Picker.Item label="€" value="EUR" />
                  <Picker.Item label="¥" value="JPY" />
                </Picker>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.filterOptionTitle}>Area Unit</Text>
                <Picker
                  selectedValue={selectedUnit}
                  onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="ft²" value="ft²" />
                  <Picker.Item label="km²" value="km²" />
                  <Picker.Item label="acres" value="acres" />
                </Picker>
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
                  <Text style={styles.rangeText}>{`${currencyLabels[selectedCurrency]} ${priceRangeValues[0]} - ${currencyLabels[selectedCurrency]} ${priceRangeValues[1]}`}</Text>
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
                  <Text style={styles.rangeText}>{`${areaRangeValues[0]} - ${areaRangeValues[1]} ${selectedUnit}`}</Text>
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
