import React from 'react'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

/**
 Generic multiple item view using a list widget.

 TODO: Achieve feature parity with TableEditor
 - noDataPlaceHolder
 - selectionActions
 - isLoading
*/
export default function ItemListView({
  title,
  rows,
  columns,
  idField,
  itemHeader,
  itemBody,
  itemActions,
  itemAvatar,
  actions,
}) {
  function stacked(rows) {
    return (
      <>
        {rows.map((row, i) => (
          <Stack direction="row" justifyContent="space-between" spacing={1} key={i}>
            {row.map ? (
              row.map((item, j) => <span key={j}>{item}</span>)
            ) : (
              <span>{row}</span>
            )}
          </Stack>
        ))}
      </>
    )
  }

  return (
    <List>
      {(title || actions) && (
        <ListSubheader>
          {stacked([
            title,
            actions && <Box>{actions.map((action, i) => action(items))}</Box>,
          ])}
        </ListSubheader>
      )}
      {rows.map((row) => {
        const labelId = `list-item-${row[idField]}2`
        return (
          <ListItem key={row[idField]} divider disablePadding>
            <ListItemAvatar>
              <Avatar>{itemAvatar(row)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              primary={stacked(itemHeader(row))}
              secondary={stacked(itemBody(row))}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
              }}
            />
            <ListItemIcon
              sx={{
                // Display icons in a column
                flexFlow: 'column',
                justifyContent: 'end',
                alignSelf: 'end',
              }}
            >
              {itemActions.map((action, i) => {
                if (action.view) return action.view(row)
              })}
            </ListItemIcon>
          </ListItem>
        )
      })}
    </List>
  )
}
