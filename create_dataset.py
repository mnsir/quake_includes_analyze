import os
import sys
import re
from itertools import chain


root_dirs = [sys.argv[i] for i in range(1, len(sys.argv))]
    

def build_include_tree(root_dirs):
    include_regex = r'#include\s*"(.+?)"'
    
    includes = {}

    def path_to_file_name(path):
        directories, file_name = os.path.split(path)
        return file_name

    def process_dir(dir_path):
        file_list = os.listdir(dir_path)
        for file in file_list:
            file_path = os.path.join(dir_path, file)
            if os.path.isdir(file_path):
                process_dir(file_path)
            elif file.endswith('.c') or file.endswith('.h'):
                process_file(file_path)

    def process_file(file_path):
        with open(file_path, 'r') as f:
            contents = f.read()
            includes[path_to_file_name(file_path)] = re.findall(include_regex, contents)
    for root_dir in root_dirs:
        process_dir(root_dir)

    return includes

def convert_to_struct(include_tree):
    names = list(set(list(include_tree.keys()) + list(chain.from_iterable(include_tree.values()))))
    links = []
    for file, dependencies in include_tree.items():
        source = names.index(file)
        for dependency in dependencies:
            target = names.index(dependency)
            links.append({'source': source, 'target': target})
    return {'nodes': [{'name': name} for name in names], 'links': links}

def get_incomings(i, links, s):
    if i not in s:
        s.add(i)
        for link in links:
            if link['source'] == i:
                get_incomings(link['target'], links, s)

def get_incoming_count(i, links):  
    s = set()
    get_incomings(i, links, s)
    return len(s)
                
def get_outcomings(i, links, s):
    if i not in s:
        s.add(i)
        for link in links:
            if link['target'] == i:
                get_outcomings(link['source'], links, s)

def get_outcoming_count(i, links):  
    s = set()
    get_outcomings(i, links, s)
    return len(s)

def calculate_weights(includes):
    for i, node in enumerate(includes['nodes']):
        incoming = get_incoming_count(i, includes['links'])
        outcoming = get_outcoming_count(i, includes['links'])
        node['scores'] = outcoming - incoming
    max_ = max(includes['nodes'], key=lambda x: x['scores'])['scores']
    min_ = min(includes['nodes'], key=lambda x: x['scores'])['scores']
    for node in includes['nodes']:
        node['weight'] = (node['scores'] - min_) / (max_ - min_)
        del node['scores']
    return includes

dataset = calculate_weights(convert_to_struct(build_include_tree(root_dirs)))

with open("dataset.js", "w") as f:
    f.write(f"const dataset = {dataset};")