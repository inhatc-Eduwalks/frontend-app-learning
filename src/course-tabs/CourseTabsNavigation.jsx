import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';


const CourseTabsNavigation = ({
  
  activeTabSlug, className, tabs, intl,
}) => {
  const [courseTitle, setCourseTitle] = useState('');
  const courseId = useSelector(state => state.courseHome.courseId);

  useEffect(() => {
    const fetchCourseTitle = async () => {
      const client = getAuthenticatedHttpClient();
      const baseUrl = getConfig().LMS_BASE_URL;
      const response = await client.get(`${baseUrl}/api/courses/v1/courses/${courseId}`);
      setCourseTitle(response.data.name);
    };

    if (courseId) {
      fetchCourseTitle();
    }
  }, [courseId]);

  console.log(courseTitle)
  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-x1 nav-header-banner">
        <div className='course-title-banner'><h2>{courseTitle}</h2></div>
      </div>
      <div className="container-xl">
        <Tabs
          className="nav-underline-tabs"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          {tabs.map(({ url, title, slug }) => (
            <a
              key={slug}
              className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
              href={url}
            >
              {title}
            </a>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
