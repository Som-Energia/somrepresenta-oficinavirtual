import React from 'react'
import SnackbarMessages from './SnackbarMessages'
import { log, error, warn, info, success } from '../services/messages'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

function Selector({ label, options, value, setValue }) {
  const id = label.split().join('-').toLowerCase()
  const labelid = id + '-label'
  const mapOptions = Array.isArray(options)
    ? Object.fromEntries(
        options.map((value) => [
          value,
          value ? value.at(0).toUpperCase() + value.slice(1) : 'Default',
        ]),
      )
    : options
  return (
    <FormControl sx={{ width: '30%', m: 1 }}>
      <InputLabel id={id + 'label'}>{label}</InputLabel>
      <Select
        variant="filled"
        labelId={labelid}
        value={value}
        label={label}
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        autoWidth
      >
        {Object.keys(mapOptions).map((value, i) => (
          <MenuItem value={value} key={i}>
            {mapOptions[value]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function SenderButton({ f }) {
  const colors = {
    log: undefined,
    error: 'error',
    warn: 'warning',
    success: 'success',
    info: 'info',
  }
  return (
    <Button
      variant="contained"
      onClick={() => f(`This is a message sent with ${f.name}() function!`)}
      color={colors[f.name]}
    >
      {`Send with ${f.name}()`}
    </Button>
  )
}

console.log('cargando lazy laziando')
export default function Example() {
  const [horizontal, setHorizontal] = React.useState('')
  const [vertical, setVertical] = React.useState('')
  const [slideTo, setSlideTo] = React.useState('')
  const [variant, setVariant] = React.useState('standard')
  return (
    <>
      <Box sx={{ display: 'flex', flexFlow: 'wrap', gap: 1, justifyContent: 'center' }}>
        <Selector
          label="Horizontal Anchor"
          value={horizontal}
          setValue={setHorizontal}
          options={['left', 'center', 'right', '']}
        />
        <Selector
          label="Vertical Anchor"
          value={vertical}
          setValue={setVertical}
          options={['top', 'bottom', '']}
        />
        <Selector
          label="Slide direction"
          value={slideTo}
          setValue={setSlideTo}
          options={['up', 'down', 'left', 'right', '']}
        />
        <Selector
          label="Variant"
          value={variant}
          setValue={setVariant}
          options={['outlined', 'filled', 'standard']}
        />
      </Box>
      <Box sx={{ display: 'flex', flexFlow: 'wrap', gap: 1, justifyContent: 'center' }}>
        <SenderButton f={log} />
        <SenderButton f={error} />
        <SenderButton f={warn} />
        <SenderButton f={success} />
        <SenderButton f={info} />
      </Box>
      <SnackbarMessages
        vertical={vertical || undefined}
        horizontal={horizontal || undefined}
        slideTo={slideTo || null}
        variant={variant}
      />
    </>
  )
}
