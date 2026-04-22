import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ListSubheader from "@mui/material/ListSubheader"
import Stack from "@mui/material/Stack"

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
  idField,
  itemHeader,
  itemBody,
  itemActions,
  itemAvatar,
  actions = [],
}) {
  function stacked(rows) {
    return (
      <>
        {rows.map((row, i) => (
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            key={i}>
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
      {(title || actions?.lengh) && (
        <ListSubheader>
          {stacked([
            title,
            actions.length && (
              <Box>{actions.map((action) => action(rows))}</Box>
            ),
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
                flexFlow: "column",
                justifyContent: "end",
                alignSelf: "end",
              }}>
              {itemActions
                .filter((action) => action.view)
                .map((action) => action.view(row))}
            </ListItemIcon>
          </ListItem>
        )
      })}
    </List>
  )
}
