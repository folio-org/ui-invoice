import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AddressView } from '@folio/stripes/smart-components';
import { Headline } from '@folio/stripes/components';
import {
  COUNTRY_LABEL_BY_CODE,
  LANG_LABEL_BY_CODE,
} from '@folio/stripes-acq-components';

import { useAddressCategories } from '../../hooks';

const visibleFields = [
  'addressLine1',
  'addressLine2',
  'city',
  'stateRegion',
  'zipCode',
  'country',
  'language',
  'categoryValues',
];

const labelMap = {
  addressLine1: <FormattedMessage id="ui-invoice.invoice.details.addressLine1" />,
  addressLine2: <FormattedMessage id="ui-invoice.invoice.details.addressLine2" />,
  city: <FormattedMessage id="ui-invoice.invoice.details.city" />,
  stateRegion: <FormattedMessage id="ui-invoice.invoice.details.stateRegion" />,
  zipCode: <FormattedMessage id="ui-invoice.invoice.details.zipCode" />,
  country: <FormattedMessage id="ui-invoice.invoice.details.country" />,
  language: <FormattedMessage id="ui-invoice.invoice.details.language" />,
  categoryValues: <FormattedMessage id="ui-invoice.invoice.details.categories" />,
};

const VendorPrimaryAddress = ({ vendor }) => {
  const primaryAddress = useMemo(() => (vendor?.addresses?.filter(({ isPrimary }) => isPrimary)?.[0] || {}), [vendor]);

  const { isLoading, categoriesMap = {} } = useAddressCategories(primaryAddress);

  const addressObject = useMemo(() => {
    const categoryValues = primaryAddress?.categories?.map(catId => categoriesMap[catId])?.filter(Boolean)?.join(', ');

    return {
      ...primaryAddress,
      categoryValues: categoryValues?.length ? categoryValues : '-',
      primaryAddress: true,
      country: COUNTRY_LABEL_BY_CODE[primaryAddress.country] || primaryAddress.country,
      language: LANG_LABEL_BY_CODE[primaryAddress.language] || primaryAddress.language,
    };
  }, [primaryAddress, categoriesMap]);

  if (!vendor?.addresses || isLoading) return null;

  return (
    <>
      <Headline margin="none">
        <FormattedMessage id="ui-invoice.invoice.details.address" />
      </Headline>
      <AddressView
        addressObject={addressObject}
        visibleFields={visibleFields}
        labelMap={labelMap}
        headingLevel={4}
      />
    </>
  );
};

VendorPrimaryAddress.propTypes = {
  vendor: PropTypes.object,
};

export default VendorPrimaryAddress;
