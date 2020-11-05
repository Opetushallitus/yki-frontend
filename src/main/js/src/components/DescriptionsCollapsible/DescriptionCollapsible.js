import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import Collapsible from "../UI/Collapsible/Collapsible";

import classes from "./DescriptionCollapsible.module.css";
import DescriptionDetail from "./DescriptionDetail/DescriptionDetail";

const DescriptionCollapsible = (props) => {
  const { t } = useTranslation();

  const [show, setOpen] = useState(false);
  const { headerText, content } = props;

  return (
      <>
        <Collapsible
            className={show ? classes.DescriptionsBarOpen : classes.DescriptionsBarClosed }
            show={show}
            clicked={() => setOpen(!show)}
        >
          <h3 className={classes.DescriptionHeader}>{t(headerText)}</h3>
          <DescriptionDetail content={content} />
        </Collapsible>
        <hr />
      </>
  )
}

DescriptionCollapsible.propTypes = {
  headerText: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
};

export default DescriptionCollapsible;