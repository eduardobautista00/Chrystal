import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from './styles';

export default function YearlyCalendar({ year = new Date().getFullYear() }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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
            state === 'selected' ? { backgroundColor: '#7B61FF' } : { backgroundColor: '#ECEAFF' },
            //isExtraDay ? { opacity: 0.5 } : {}, // Apply gray styling to extra days
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
                isToday ? styles.todayText : {}, // Special styling for today's text
                state === 'selected' ? styles.selectedDay : {},
                isExtraDay ? { color: '#B0B0B0' } : {}, // Grayed-out text for extra days
              ]}
            >
              {date.day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    
    

  return (
    <ScrollView style={styles.container} 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}>
       {/* Header with Year and Navigation Buttons */}
       <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setCurrentYear((prevYear) => prevYear - 1)}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{currentYear}</Text>
        <TouchableOpacity
          onPress={() => setCurrentYear((prevYear) => prevYear + 1)}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid for the Current Year */}
      <View style={styles.monthsContainer}>
      {generateMonths(currentYear).map((month) => (
          <View key={month} style={styles.monthContainer}>
            <Calendar
              current={month} // Explicitly set the current month
              monthFormat={'MMMM'}
              dayComponent={dayComponent}
              hideArrows
              disableMonthChange
              theme={{
                calendarBackground: '#ECEAFF',
                textDayFontSize: 10,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 10,
                textDayHeaderFontWeight: '600',
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
