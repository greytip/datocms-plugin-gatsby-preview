import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToDatoCms from './connectToDatoCms';
import './style.sass';

const urljoin = require('url-join');


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
    moduleUrlPath: '',
  }

  componentDidMount() {
    const { plugin } = this.props;
    const slug = plugin.getFieldValue('slug');
    const {
      parameters: {
        global: { gatsbySiteBaseUrl, developmentMode },
      },
    } = plugin;

    const {
      parameters: {
        instance: { moduleUrlPath },
      },
    } = plugin;

    if (developmentMode) {
      console.error(`Gatsy site Base URL: ${gatsbySiteBaseUrl}`);
      console.error(`Is Development Mode: ${developmentMode}`);
      console.error(`Instance Moudule URL Path: ${moduleUrlPath}`);
    }

    this.unsubscribe = plugin.addFieldChangeListener('slug', (value) => {
      this.setState({ slug: value });
    });
    this.setState({
      slug,
      gatsbySiteBaseUrl: checkEndOfUrl(gatsbySiteBaseUrl),
      moduleUrlPath,
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      slug,
      gatsbySiteBaseUrl,
      moduleUrlPath,
    } = this.state;

    // const fullLink = `${gatsbySiteBaseUrl}${slug}`;
    // const fullLink = gatsbySiteBaseUrl ? new URL(slug, gatsbySiteBaseUrl).href : null;
    const fullLink = urljoin(gatsbySiteBaseUrl, moduleUrlPath, slug);
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
