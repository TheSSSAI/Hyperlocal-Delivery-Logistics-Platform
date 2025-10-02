/**
 * @file Barrel file for the Modal organism.
 *
 * This file serves as the main entry point for the Modal component.
 * It conditionally exports the platform-specific implementation.
 *
 * For web environments (React DOM), it exports from './Modal.web'.
 * React Native's Metro bundler is configured to automatically resolve
 * this module to './Modal.native' for mobile environments.
 *
 * It also re-exports the shared types for the component, ensuring that
 * consumers on any platform can use the correct props interface.
 *
 * @package platform-ui-components
 * @see REQ-1-086 - WCAG 2.1 Level AA accessibility.
 * @see SDS - Component Specification for 'Modal'.
 */

export * from './Modal.web';
export * from './Modal.types';