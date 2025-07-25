import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setTimeframe, Timeframe } from '@/store/timeframeSlice';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const timeframes: { label: string; value: Timeframe }[] = [
  { label: 'Day', value: '1d' },
  { label: 'Week', value: '1w' },
  { label: 'Month', value: '1M' },
];

const TimeframeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.timeframe.value);

  return (
    <ButtonGroup variant="outlined" color="primary" aria-label="Timeframe selector">
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          variant={selected === tf.value ? 'contained' : 'outlined'}
          onClick={() => dispatch(setTimeframe(tf.value))}
        >
          {tf.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default TimeframeSelector; 