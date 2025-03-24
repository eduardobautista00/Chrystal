import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from './styles';
import { useDarkMode } from '../../context/DarkModeContext';

export default function YearlyCalendar({ year = new Date().getFullYear() }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { isDarkMode } = useDarkMode();
  // Generate ISO strings for each month in the given year
  const generateMonths = (year) =>
    Array.from({ length: 12 }, (_, i) => 
      `${year}-${String(i + 1).padStart(2, '0')}` // '2025-01', '2025-02', ..., '2025-12'
    );

    const dayComponent = ({ date, state }) => {
      const isToday = date.dateString === new Date().toISOString().split('T')[0]; // Check if it's today's date
      const isExtraDay = state === 'disabled'; // Check if the day is from the previous or next month
    
      return (
        <TouchableOpacity
          style={[
            styles.dayContainer,
            { borderRadius: 0 }, // Rectangular day cell
            { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' },
            { borderColor: isDarkMode ? '#404040' : '#ddd' },
            { borderWidth: 0.5 }
          ]}
          // onPress={() => handleDatePress(date)} // Enable interaction for all dates
        >
          <View
            style={[
              styles.dayCircle, // Circle wrapper
              isToday ? styles.todayCircle : null, // Apply circle only for today
            ]}
          >
            <Text
              style={[
                styles.dayText,
                { color: isDarkMode ? '#FFFFFF' : '#000000' },
                isToday ? styles.todayText : {}, // Special styling for today's text
                state === 'selected' ? styles.selectedDay : {},
                isExtraDay ? { color: isDarkMode ? '#404040' : '#B0B0B0' } : {}, // Grayed-out text for extra days
              ]}
            >
              {date.day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    
    

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]} 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}>
       {/* Header with Year and Navigation Buttons */}
       <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
        <TouchableOpacity
          onPress={() => setCurrentYear((prevYear) => prevYear - 1)}
          style={[styles.navButton]}
        >
          <Text style={[styles.navButtonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>◀</Text>
        </TouchableOpacity>
        <Text style={[styles.header, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{currentYear}</Text>
        <TouchableOpacity
          onPress={() => setCurrentYear((prevYear) => prevYear + 1)}
          style={[styles.navButton]}
        >
          <Text style={[styles.navButtonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid for the Current Year */}
      <View style={[styles.monthsContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
      {generateMonths(currentYear).map((month) => (
          <View key={month} style={[styles.monthContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }, { borderColor: isDarkMode ? '#fff' : '#000' }, { borderWidth: 1 }]}>
            <Calendar
              current={month} // Explicitly set the current month
              monthFormat={'MMMM'}
              dayComponent={dayComponent}
              hideArrows
              disableMonthChange
              theme={{
                calendarBackground: isDarkMode ? '#1A1A1A' : '#ECEAFF',
                textDayFontSize: 10,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 10,
                textDayHeaderFontWeight: '600',
                monthTextColor: isDarkMode ? '#FFFFFF' : '#000000',
                textSectionTitleColor: isDarkMode ? '#FFFFFF' : '#000000',
                'stylesheet.calendar.header': {
                  week: {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 5,
                  },
                },
              }}
              style={styles.calendarStyle}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
