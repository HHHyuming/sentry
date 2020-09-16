import React from 'react';
import styled from '@emotion/styled';
import sortBy from 'lodash/sortBy';

import {t} from 'app/locale';
import space from 'app/styles/space';
import {Organization, Project} from 'app/types';
import DropdownAutoComplete from 'app/components/dropdownAutoComplete';
import Button from 'app/components/button';
import theme from 'app/utils/theme';
import {IconAdd} from 'app/icons';

const defaultProps = {
  projectId: null,
  // Allow selecting multiple projects
  multi: false,
  // Callback when a project is selected
  onSelect: () => {},
};

type ChildrenProps = {
  selectedProjects: Array<Project>;
};

type Props = {
  organization: Organization;

  // used by multiProjectSelector
  multiProjects: Array<string> | Array<Project>;

  nonMemberProjects: Array<Project>;

  // Render a footer at the bottom of the list
  // render function that is passed an `actions` object with `close` and `open` properties.
  menuFooter: () => React.ReactNode;

  // Allow selecting multiple projects?
  multi: boolean;

  // Use this if the component should be a controlled component
  selectedProjects: Array<Project>;

  // Callback when a project is selected
  onSelect: () => void;

  // Callback when the menu is closed
  onClose: () => void;

  // Callback when the input filter changes
  onFilterChange: () => void;

  // Callback when the list is scrolled
  onScroll: () => void;

  // Callback when projects are selected via the multiple project selector
  // Calls back with (projects[], event)
  onMultiSelect: () => void;
  rootClassName: string;

  // Represents if a search is taking place
  searching: boolean;

  // Represents if the current project selector is paginated or fully loaded.
  // Currently only used to ensure that in an empty state the input is not
  // hidden. This is for the case in which a user searches for a project which
  // does not exist. If we hide the input due to no results, the user cannot
  // recover.
  paginated: boolean;

  children: (props: ChildrenProps) => React.ReactNode;

  className?: string;
} & typeof defaultProps;

type State = {
  selectedProjects: any;
};

const  ProjectSelector= () => {
  getProjects = () => {
    const {multiProjects, nonMemberProjects = [], selectedProjects = []} = this.props;

    return [
      sortBy(multiProjects, project => [
        !selectedProjects.includes(project),
        !project.isBookmarked,
        project.slug,
      ]),
      sortBy(nonMemberProjects, project => [project.slug]),
    ];
  }

  handleSelect = ({value: project}) => {
    const {onSelect} = this.props;
    onSelect(project);
  };

  handleMultiSelect = (project, e) => {
    const {onMultiSelect, selectedProjects} = this.props;
    const hasCallback = typeof onMultiSelect === 'function';

    if (!hasCallback) {
      // eslint-disable-next-line no-console
      console.error(
        'ProjectSelector is a controlled component but `onMultiSelect` callback is not defined'
      );
      return;
    }

    const selectedProjectsMap = new Map(selectedProjects.map(p => [p.slug, p]));
    if (selectedProjectsMap.has(project.slug)) {
      // unselected a project

      selectedProjectsMap.delete(project.slug);
    } else {
      selectedProjectsMap.set(project.slug, project);
    }

    onMultiSelect(Array.from(selectedProjectsMap.values()), e);
  };

  getProjectItem = (project: Project) => {
    const {multi} = this.props;
    return {
      value: project,
      searchKey: project.slug,
      label: ({inputValue}) => (
        <ProjectSelectorItem
          project={project}
          organization={org}
          multi={multi}
          inputValue={inputValue}
          isChecked={
            !!this.props.selectedProjects.find(({slug}) => slug === project.slug)
          }
          style={{padding: 0}}
          onMultiSelect={this.handleMultiSelect}
        />
      ),
    };
  };

  getItems(projects: Array<Project>, nonMemberProjects: Array<Project>) {
    return [
      {
        hideGroupLabel: true,
        items: projects.map(this.getProjectItem),
      },
      {
        hideGroupLabel: nonMemberProjects.length === 0,
        itemSize: 'small',
        id: 'no-membership-header', // needed for tests for non-virtualized lists
        label: <Label>{t("Projects I don't belong to")}</Label>,
        items: nonMemberProjects.map(this.getProjectItem),
      },
    ];
  }

  render() {
    const {
      children,
      organization,
      menuFooter,
      className,
      rootClassName,
      onClose,
      onFilterChange,
      onScroll,
      searching,
      paginated,
    } = this.props;

    const orgSlug = organization.slug;

    const [projects, nonMemberProjects] = this.getProjects();

    const hasProjects = !!projects?.length || !!nonMemberProjects?.length;

    const hasProjectWrite = organization.access.includes('project:write');

    return (
      <DropdownAutoComplete
        alignMenu="left"
        allowActorToggle
        closeOnSelect
        blendCorner={false}
        searchPlaceholder={t('Filter projects')}
        onSelect={this.handleSelect}
        onClose={onClose}
        onChange={onFilterChange}
        busyItemsStillVisible={searching}
        onScroll={onScroll}
        maxHeight={500}
        zIndex={theme.zIndex.dropdown}
        css={{marginTop: 6}}
        inputProps={{style: {padding: 8, paddingLeft: 10}}}
        rootClassName={rootClassName}
        className={className}
        emptyMessage={t('You have no projects')}
        noResultsMessage={t('No projects found')}
        virtualizedHeight={theme.headerSelectorRowHeight}
        virtualizedLabelHeight={theme.headerSelectorLabelHeight}
        emptyHidesInput={!paginated}
        inputActions={() => (
          <AddButton
            disabled={!hasProjectWrite}
            to={`/organizations/${orgSlug}/projects/new/`}
            size="xsmall"
            icon={<IconAdd size="xs" isCircled />}
            title={
              !hasProjectWrite
                ? t("You don't have permission to add a project")
                : undefined
            }
          >
            {t('Project')}
          </AddButton>
        )}
        menuFooter={renderProps => {
          const renderedFooter =
            typeof menuFooter === 'function' ? menuFooter(renderProps) : menuFooter;
          const showCreateProjectButton = !hasProjects && hasProjectWrite;

          if (!renderedFooter && !showCreateProjectButton) {
            return null;
          }

          return (
            <React.Fragment>
              {showCreateProjectButton && (
                <CreateProjectButton
                  priority="primary"
                  size="small"
                  to={`/organizations/${orgSlug}/projects/new/`}
                >
                  {t('Create project')}
                </CreateProjectButton>
              )}
              {renderedFooter}
            </React.Fragment>
          );
        }}
        items={hasProjects ? this.getItems(projects, nonMemberProjects) : []}
      >
        {renderProps =>
          children({
            ...renderProps,
            selectedProjects: this.props.selectedProjects,
          })
        }
      </DropdownAutoComplete>
    );
  }
}

export default ProjectSelector;

const Label = styled('div')`
  font-size: ${p => p.theme.fontSizeSmall};
  color: ${p => p.theme.gray500};
`;

const AddButton = styled(Button)`
  display: block;
  margin: 0 ${space(1)};
  color: ${p => p.theme.gray500};

  :hover {
    color: ${p => p.theme.gray600};
  }
`;

const CreateProjectButton = styled(Button)`
  display: block;
  text-align: center;
  margin: ${space(0.5)} 0;
`;
