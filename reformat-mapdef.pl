#!/usr/bin/perl

my @objects;
my %tiles;

while (<>) {
	if (/\(\w+,\w+/) {
		push @objects, $_;
	} elsif (/(\d+,\d+,\d+):\w*\((\w+)\)/) {
		$tiles{$2} = $1;
	}
}

for (@objects) {
	/(\d+,\d+,\d+):\w*\((\w+),(\w+)\)/;
	print '"' . $1 . '"' . ": {\n";
	print '  "images": [' . "\n";
	print '    "textures/' . $2 . '",' . "\n";
	print "  ],\n";
	print '  "floorTile": "' . $tiles{$3} . '"},' . "\n";
	print "},\n";
}
