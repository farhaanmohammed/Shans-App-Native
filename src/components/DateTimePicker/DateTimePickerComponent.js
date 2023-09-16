import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerComponent = ({ label, selectedDate, selectedTime, setSelectedDate, setSelectedTime, open, setOpen }) => {
    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setSelectedDate(selectedDate);
            setOpen(false);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setSelectedTime(selectedTime);
            setOpen(false);
        }
    };

    return (
        <View>
            <Text style={{ color: "#343230", fontWeight: "bold", fontSize: 16 }}>{label}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>
                    {selectedDate ? selectedDate.toDateString() : 'Select a date'}
                    {selectedTime ? ` - ${selectedTime.toLocaleTimeString()}` : ''}
                </Text>
                <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
                    </TouchableOpacity>
                </View>
            </View>
            {open && (
                <DateTimePicker
                    testID="Assigned on date"
                    value={selectedDate || new Date()}
                    mode="date"
                    onChange={handleDateChange}
                    display="default"
                />
            )}
            {open && (
                <DateTimePicker
                    testID="Assigned on time"
                    value={selectedTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={handleTimeChange}
                    display="default"
                />
            )}
        </View>
    );
};

export default DateTimePickerComponent;
