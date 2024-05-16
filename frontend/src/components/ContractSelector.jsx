import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InstallationContext } from './InstallationProvider';

export default function ContractSelector({ setContract, contract }) {
  const {
    installations, loading: listLoading, error: listError,
  } = React.useContext(InstallationContext);
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (installations === null)
      return;
    setContract(installations[0]?.contract_number);
  }, [installations]);

  return (
    installations && (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
        }}
      >
        <FormControl size="small">
          <InputLabel id="contract-select-label">
            {t('PRODUCTION.LABEL_CONTRACT')}
          </InputLabel>
          <Select
            labelId="contract-select-label"
            id="contract-select"
            value={contract || installations[0].contract_number}
            label={t('PRODUCTION.LABEL_CONTRACT')}
            onChange={(ev) => setContract(ev.target.value)}
          >
            {installations &&
              installations.map(({ contract_number, installation_name }) => {
                return (
                  <MenuItem key={contract_number} value={contract_number}>
                    {`${installation_name} [${contract_number}]`}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>
    )
  );
};
