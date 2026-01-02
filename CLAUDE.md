# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a website analysis and migration project for dickensandballsworth.com (a band website). The project is currently in the discovery phase, focusing on documenting the existing site structure, content, and design before migration.

## Project Goals

The primary objective is to analyze the existing website at https://dickensandballsworth.com and prepare for migration. This involves:

1. **Site Discovery**: Comprehensive documentation of all pages, content, design elements, and integrations
2. **Content Inventory**: Cataloging text, images, embedded media (Spotify, YouTube, Bandcamp, SoundCloud), and interactive elements
3. **Design Analysis**: Documenting color palette, typography, layout patterns, and overall aesthetic
4. **Integration Mapping**: Identifying social media links, third-party widgets, and contact/booking mechanisms

## Key Deliverables

### site-analysis.md
The main deliverable is `site-analysis.md` - a comprehensive markdown report that should include:
- Summary section with total page count, image count/URLs, key integrations, and migration recommendations
- Per-page breakdown organized by navigation hierarchy
- Detailed documentation of all content, design, and integration findings

## Working with the Site

### Capturing Screenshots
Use Puppeteer MCP integration to capture screenshots with proper viewport settings:
- Desktop viewport: 1920x1080 for standard desktop layouts
- The site uses decorative typography and visual styling that should be documented

### Analysis Workflow
1. Navigate and screenshot pages using Puppeteer
2. Document findings in structured markdown format
3. Ask clarifying questions before proceeding to asset download or site construction phases
4. Focus on comprehensive discovery before moving to implementation

## Project Structure

Currently minimal - documentation and assets will be added during the discovery phase:
- `requirements.md`: Project requirements and phase definitions
- `site-analysis.md`: (To be created) Main analysis deliverable
- Screenshots and downloaded assets will be organized as the project progresses
