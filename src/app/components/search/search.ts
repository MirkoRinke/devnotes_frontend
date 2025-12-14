import { Component } from '@angular/core';
import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  inputFeldVisible: boolean = false;

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
  ) {}

  toggleInputFeld() {
    this.inputFeldVisible = !this.inputFeldVisible;
  }

  handelSearch(inputValue: string) {
    this.searchService.searchValueInput(inputValue);
  }
}
