// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterOverlay, Input } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  value?: string;
}

interface State {
  value: string;
  isValid: boolean;
}

function stateFromValue (value: string): State {
  return {
    isValid: isHex(value, 256) || /^\d+$/.test(value),
    value
  };
}

function Query ({ className = '', value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, value }, setState] = useState(() => stateFromValue(propsValue || ''));

  const _setHash = useCallback(
    (value: string): void => setState(stateFromValue(value)),
    []
  );

  const _onQuery = useCallback(
    (): void => {
      if (isValid && value.length !== 0) {
        window.location.hash = `/explorer/query/${value}`;
      }
    },
    [isValid, value]
  );

  return (
    <FilterOverlay className={`ui--FilterOverlay hasOwnMaxWidth ${className}`}>
      <Input
        className='explorer--query'
        defaultValue={propsValue}
        isError={!isValid && value.length !== 0}
        onChange={_setHash}
        onEnter={_onQuery}
        placeholder={t<string>('block hash or number to query')}
        withLabel={false}
      >
        <div onClick={_onQuery} className={'searchButton'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="rgba(34, 36, 38, 0.15)" strokeWidth="2"/>
            <path d="M20 20L17 17" stroke="rgba(34, 36, 38, 0.15)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </Input>
    </FilterOverlay>
  );
}

export default React.memo(styled(Query)`
  .explorer--query {
    width: 20em;
  }
  .searchButton{
    padding-left: 5px;
    display: flex;
    align-items: center;
  }
  .searchButton:hover{
    cursor: pointer
  }
`);
