import React from 'react'
import List from '@mui/material/List'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useTranslation } from 'react-i18next'
import format from '../../services/format'

export default function InvoiceList({
  rows,
  columns,
  idField,
  primaryText,
  secondaryText,
  ternaryText,
  quaternaryText,
  itemActions,
  avatar,
}) {
  const { t } = useTranslation()
  function handleClick(item) {
    console.log('Clicked ', item)
  }
  function handleTogleSelection(row) {
    console.log('Toggle ', row)
  }
  return (
    <List sx={{height: '100%', overflow: 'scroll'}}>
      {rows.map((row) => {
        const labelId = `list-item-${row[idField]}2`
        return (
          <ListItem
            alignItems="end"
            key={row[idField]}
            divider
            disablePadding
          >
            <ListItemAvatar>
              <Avatar>
                {avatar(row)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              primary={primaryText(row)}
              secondary={secondaryText(row)}
            />
            <ListItemIcon sx={{
              justifyContent: 'end',
              alignSelf: "end",
              flexFlow: 'column'
            }}>
              {itemActions.map((action, i)=>{
                if (action.view) return action.view(row)
              })}
            </ListItemIcon>
          </ListItem>
        )
      })}
    </List>
  )
}
