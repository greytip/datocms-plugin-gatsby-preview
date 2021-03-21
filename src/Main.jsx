import React, { Component } from 'react';
import PropTypes from 'prop-types';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

const capitalizeFirstLetter = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const checkEndOfUrl = (url) => {
  if (url === '') return url;
  const trimedUrl = url.trim();
  return trimedUrl.charAt(trimedUrl.length - 1) === '/' ? trimedUrl : `${trimedUrl}/`;
};

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))
export default class Main extends Component {
  static propTypes = {
    plugin: PropTypes.object.isRequired,
  }

  state = {
    slug: '',
    gatsbySiteBaseUrl: '',
  }

  componentDidMount() {
    const { plugin } = this.props;
    const slug = plugin.getFieldValue('slug');
    const {
      parameters: {
        global: { gatsbySiteBaseUrl, developmentMode },
      },
    } = plugin;

    if (developmentMode) {
      console.error(`Gatsy site Base URL: ${gatsbySiteBaseUrl}`);
      console.error(`Is Development Mode: ${developmentMode}`);
    }

    this.unsubscribe = plugin.addFieldChangeListener('slug', (value) => {
      this.setState({ slug: value });
    });
    this.setState({
      slug,
      gatsbySiteBaseUrl: checkEndOfUrl(gatsbySiteBaseUrl),
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleClick = name => () => {
    const visible = name ? `isVisible${capitalizeFirstLetter(name)}FullLink` : 'isVisibleFullLink';

    this.setState(prevState => ({
      [visible]: !prevState[visible],
    }));
  }

  render() {
    const {
      slug,
      gatsbySiteBaseUrl,
    } = this.state;

    // const fullLink = `${gatsbySiteBaseUrl}${slug}`;
    const fullLink = gatsbySiteBaseUrl ? new URL(slug, gatsbySiteBaseUrl).href : null;
    return (
      <div className="container">
        <h1>Preview URL:</h1>
        {gatsbySiteBaseUrl && (
          <>
            <div className="link-wrap">
              <a href={fullLink} title={slug} target="_blank" rel="noopener noreferrer" className="preview-link">
                {fullLink}
              </a>
            </div>
          </>
        )}
      </div>
    );
  }
}
