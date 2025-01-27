import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import styles from './styles';

export default function FilterScreen() {
  const [filters, setFilters] = useState([{ id: 1, name: 'Hot', color: '#ff4d4d' }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState(null);
  const [newFilterName, setNewFilterName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff4d4d');
  const colors = ['#1a75ff', '#4d4dff', '#ff4d4d', '#ff66b2', '#cc00ff', '#ffcc00', '#990000', '#00e673', '#4ddbff'];

  const openModal = (filter = null) => {
    if (filter) {
      setIsEditMode(true);
      setCurrentFilterId(filter.id);
      setNewFilterName(filter.name);
      setSelectedColor(filter.color);
    } else {
      setIsEditMode(false);
      setNewFilterName('');
      setSelectedColor('#ff4d4d');
    }
    setIsModalVisible(true);
  };

  const saveFilter = () => {
    if (isEditMode) {
      // Update the existing filter
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) =>
          filter.id === currentFilterId
            ? { ...filter, name: newFilterName, color: selectedColor }
            : filter
        );
        // Sort filters by length of the filter name
        return updatedFilters.sort((a, b) => a.name.length - b.name.length);
      });
    } else {
      // Create a new filter
      const newFilter = {
        id: Date.now(),
        name: newFilterName,
        color: selectedColor,
      };
      setFilters((prevFilters) => {
        const updatedFilters = [...prevFilters, newFilter];
        // Sort filters by length of the filter name
        return updatedFilters.sort((a, b) => a.name.length - b.name.length);
      });
    }
  
    // Reset modal inputs
    setNewFilterName('');
    setSelectedColor('#ff4d4d');
    setIsModalVisible(false);
  };
  
  const deleteFilter = (id) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter</Text>

      {/* Make this section scrollable */}
      <ScrollView contentContainerStyle={styles.filterContainer} horizontal={false} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.allFilter}>
          <Text style={styles.allText}>All</Text>
        </TouchableOpacity>
        {filters.map((filter) => (
          <View key={filter.id} style={[styles.filterButton, { backgroundColor: filter.color }]}>
            <Text style={styles.filterText}>{filter.name}</Text>
            <TouchableOpacity onPress={() => openModal(filter)} style={styles.editButton}>
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFilter(filter.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={() => openModal()} style={styles.addFilter}>
          <Text style={styles.addFilterText}>Add filter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for adding/editing a filter */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>{isEditMode ? 'Edit Filter' : 'Add Filter'}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter filter name"
            maxLength={15}
            value={newFilterName}
            onChangeText={setNewFilterName}
          />
          {/* Character counter */}
            <View style={styles.characterCounterContainer}>
            <Text style={styles.characterCounterText}>
                {newFilterName.length} / 15
            </Text>
            </View>
          <Text style={styles.colorPickerText}>Pick a color</Text>
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
          {/* Save button (disabled if character limit is reached) */}
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
