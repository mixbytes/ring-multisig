import * as React from 'react';
import InlineSVG from 'svg-inline-react';

import './Loader.less';

class Loader extends React.Component {
  render() {
    const { text = null, width = '100px', className = '' } = this.props;

    return (
      <div className={`spinner flex ${className}`}>
        <InlineSVG
          style={{ width, height: width }}
          src={require('../../assets/loading.svg')}
        />
        {text !== null && <p className="support-block__paragraph">{text}</p>}
      </div>
    );
  }
}

export default Loader;
