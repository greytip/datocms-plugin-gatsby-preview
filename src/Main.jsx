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
    region: '',
    slug: '',
    gatsbySiteBaseUrl: '',
    moduleUrlPath: '',
    slugPrefix: '',
  }

  componentDidMount() {
    const { plugin } = this.props;
    const slug = plugin.getFieldValue('slug');
    const region = plugin.getFieldValue('region');
    const {
      parameters: {
        global: { gatsbySiteBaseUrl, developmentMode },
      },
    } = plugin;

    const {
      parameters: {
        instance: { moduleUrlPath, slugPrefix },
      },
    } = plugin;

    if (developmentMode) {
      console.error(`Gatsy site Base URL: ${gatsbySiteBaseUrl}`);
      console.error(`Is Development Mode: ${developmentMode}`);
      console.error(`Instance Moudule URL Path: ${moduleUrlPath}`);
      console.error(`Slug Prefix: ${slugPrefix}`);
      console.error(`Region: ${region}`);
    }

    this.unsubscribeSlug = plugin.addFieldChangeListener('slug', (value) => {
      this.setState({ slug: value });
    });

    this.unsubscribeRegion = plugin.addFieldChangeListener('region', (value) => {
      this.setState({ region: value });
    });

    this.setState({
      region,
      slug,
      gatsbySiteBaseUrl: checkEndOfUrl(gatsbySiteBaseUrl),
      moduleUrlPath,
      slugPrefix,
    });
  }

  componentWillUnmount() {
    this.unsubscribeSlug();
    this.unsubscribeRegion();
  }

  render() {
    const {
      region,
      slug,
      gatsbySiteBaseUrl,
      moduleUrlPath,
      slugPrefix,
    } = this.state;

    // const fullLink = `${gatsbySiteBaseUrl}${slug}`;
    // const fullLink = gatsbySiteBaseUrl ? new URL(slug, gatsbySiteBaseUrl).href : null;
    let regionPath = region;
    if (regionPath) {
      regionPath = regionPath.trim();
      if (regionPath.indexOf(',') > -1) {
        [regionPath] = regionPath.split(',').filter(item => item !== 'india');
      } else if (region === 'india') {
        regionPath = '';
      }
    } else {
      regionPath = '';
    }
    const slugPath = `${slugPrefix}${slug}`;
    const fullLink = urljoin(gatsbySiteBaseUrl, regionPath, moduleUrlPath, slugPath);
    return (
      <div className="container">
        <h1>Preview URL:</h1>
        {gatsbySiteBaseUrl && (
          <>
            <div className="link-wrap">
              <a href={fullLink} title={slugPath} target="_blank" rel="noopener noreferrer" className="preview-link">
                {fullLink}
              </a>
            </div>
          </>
        )}
      </div>
    );
  }
}
