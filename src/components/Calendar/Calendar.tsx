"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TimeframeSelector from './TimeframeSelector';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchKlinesThunk } from '@/store/dataSlice';
import { BinanceInterval } from '@/services/binance';

const timeframeToBinanceInterval: Record<string, BinanceInterval> = {
  '1d': '1d',
  '1w': '1w',
  '1M': '1M',
};

const Calendar = () => {
  // Redux state
  const dispatch = useDispatch<AppDispatch>();
  const symbol = useSelector((state: RootState) => state.instrument.symbol);
  const timeframe = useSelector((state: RootState) => state.timeframe.value);
  const { data, loading, error } = useSelector((state: RootState) => state.data);

  // Local state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [focusedDate, setFocusedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch Binance data when symbol or timeframe changes
  useEffect(() => {
    const binanceInterval = timeframeToBinanceInterval[timeframe] || '1d';
    dispatch(fetchKlinesThunk({ symbol, interval: binanceInterval }));
  }, [symbol, timeframe, dispatch]);

  // Date utility functions
  const startOfMonth = (date:Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date:Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const startOfWeek = (date:Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const endOfWeek = (date:Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    return d;
  };

  const addDays = (date:Date, days:number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addMonths = (date:Date, months:number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const subMonths = (date:Date, months:number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  };

  const isSameMonth = (date1:Date, date2:Date) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
  };

  const isSameDay = (date1:Date, date2:Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const formatMonth = (date:Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatFullDate = (date:Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Add ordinal suffix
    const getOrdinal = (n:number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${dayName}, ${monthName} ${getOrdinal(day)}, ${year}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
    setFocusedDate(now);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (!calendarRef.current || !(calendarRef.current as HTMLElement).contains(document.activeElement)) return;

      let newFocusedDate = new Date(focusedDate);
      let preventDefault = true;

      switch (e.key) {
        case 'ArrowLeft':
          newFocusedDate = addDays(focusedDate, -1);
          break;
        case 'ArrowRight':
          newFocusedDate = addDays(focusedDate, 1);
          break;
        case 'ArrowUp':
          newFocusedDate = addDays(focusedDate, -7);
          break;
        case 'ArrowDown':
          newFocusedDate = addDays(focusedDate, 7);
          break;
        case 'Home':
          newFocusedDate = startOfWeek(focusedDate);
          break;
        case 'End':
          newFocusedDate = endOfWeek(focusedDate);
          break;
        case 'PageUp':
          newFocusedDate = subMonths(focusedDate, 1);
          break;
        case 'PageDown':
          newFocusedDate = addMonths(focusedDate, 1);
          break;
        case 'Enter':
        case ' ':
          setSelectedDate(new Date(focusedDate));
          break;
        case 'Escape':
          goToToday();
          break;
        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            goToToday();
          } else {
            preventDefault = false;
          }
          break;
        default:
          preventDefault = false;
      }

      if (preventDefault) {
        e.preventDefault();
        if (newFocusedDate.getTime() !== focusedDate.getTime()) {
          setFocusedDate(newFocusedDate);
          
          // Change month if navigated outside current month
          if (!isSameMonth(newFocusedDate, currentDate)) {
            setCurrentDate(newFocusedDate);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedDate, currentDate]);

  const handleDateClick = (date:Date) => {
    setSelectedDate(date);
    setFocusedDate(date);
    
    // Change month if clicked date is in different month
    if (!isSameMonth(date, currentDate)) {
      setCurrentDate(date);
    }
  };

  const getDayClasses = (date:Date) => {
    const baseClasses = "w-full h-10 sm:h-12 md:h-14 flex items-center justify-center text-sm sm:text-base font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";
    
    const isToday = isSameDay(date, today);
    const isSelected = isSameDay(date, selectedDate);
    const isFocused = isSameDay(date, focusedDate);
    const isCurrentMonth = isSameMonth(date, currentDate);
    
    let classes = baseClasses;
    
    if (!isCurrentMonth) {
      classes += " text-gray-400 hover:text-gray-600 hover:bg-gray-100";
    } else if (isSelected) {
      classes += " bg-blue-600 text-white shadow-lg hover:bg-blue-700 scale-105";
    } else if (isToday) {
      classes += " bg-blue-100 text-blue-800 font-bold border-2 border-blue-400 hover:bg-blue-200 shadow-md";
    } else {
      classes += " text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105";
    }
    
    if (isFocused && !isSelected) {
      classes += " ring-2 ring-blue-300 ring-offset-1";
    }
    
    return classes;
  };

  return (
    <div 
      ref={calendarRef}
      className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200"
      tabIndex={0}
    >
      {/* Timeframe Selector */}
      <div className="mb-4 flex justify-end">
        <TimeframeSelector />
      </div>
      {/* Data Fetching Status */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Instrument: <b>{symbol}</b> | Timeframe: <b>{timeframe}</b></span><br />
        {loading && <span className="text-blue-600">Loading Binance data...</span>}
        {error && <span className="text-red-600">Error: {error}</span>}
        {!loading && !error && data[symbol] && data[symbol][timeframeToBinanceInterval[timeframe]] && (
          <pre className="text-xs bg-gray-100 rounded p-2 mt-2 overflow-x-auto">
            {JSON.stringify(data[symbol][timeframeToBinanceInterval[timeframe]][0], null, 2)}
          </pre>
        )}
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatMonth(currentDate)}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Today
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-7 gap-1 sm:gap-2 p-2 bg-white rounded-lg shadow-inner"
        role="grid"
        aria-label="Calendar"
      >
        {calendarDays.map((date, index) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateClick(date)}
            className={getDayClasses(date)}
            aria-label={formatFullDate(date)}
            aria-selected={isSameDay(date, selectedDate)}
            tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
          >
            {date.getDate()}
          </button>
        ))}
      </div>

      {/* Footer with keyboard shortcuts info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium mb-2 text-gray-700">Keyboard shortcuts:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-gray-600">
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">←→↑↓</kbd> Navigate dates</p>
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> Select date</p>
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">PgUp</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">PgDn</kbd> Change month</p>
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Home</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">End</kbd> Week start/end</p>
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">T</kbd> Go to today</p>
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> Go to today</p>
          </div>
        </div>
      </div>

      {/* Selected date display */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Selected:</span> <span className="font-medium">{formatFullDate(selectedDate)}</span>
        </p>
        {isSameDay(selectedDate, today) && (
          <p className="text-xs text-blue-600 mt-1 font-medium">📅 Today's date</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;